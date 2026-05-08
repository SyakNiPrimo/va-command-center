/**
 * VA Command Center - Gmail MLS Listing Updates Sync
 *
 * Paste this file into Extensions > Apps Script from the Task Tracker Google Sheet.
 * Deploy as Web app:
 * - Execute as: Me
 * - Who has access: Anyone with the link, or your Workspace users
 *
 * Copy the Web app URL into app.js as gmailListingSyncUrl.
 * Test first with: WEB_APP_URL?dryRun=true
 */
const SPREADSHEET_ID = "1nmdNyzfdG7V3guU7BmghtTaujAun7TDkRyK5WefTJ04";
const SOCIAL_POSTS_SHEET = "Social Post Tasks";
const SOURCE_LABEL = "Listing Updates";
const PROCESSED_LABEL = "Processed Listing Updates";
const REVIEW_LABEL = "Needs Review Listing Updates";

const SOCIAL_HEADERS = [
  "ID", "Date Received", "Agent Name", "Listing Type", "MLS#", "MLS Link", "Property Address", "Price",
  "Bedrooms", "Bathrooms", "Approximate Square Feet", "MLS Description", "Duplicate Validation", "Status (Workflow)",
  "Logo Type", "Agent Headshot Link", "Agent Headshot File", "Agent Headshot Found", "Agent Headshot Confirmed",
  "Agent Name Confirmed", "Agent Phone Confirmed", "Agent Email Confirmed", "Agent Instagram Handle",
  "Agent Instagram Handle Confirmed", "Subject", "Email Template", "Canva Video Link", "Graphics Created?", "Posted",
  "Date Posted", "Graphics Link", "Caption", "IG Post Link", "Source Email ID", "Source Email Subject",
  "Source Email Date", "Date Processed"
];

function doGet(event) {
  return runEndpoint(event);
}

function doPost(event) {
  return runEndpoint(event);
}

function runEndpoint(event) {
  let result;
  try {
    const dryRun = String(event?.parameter?.dryRun || "").toLowerCase() === "true";
    result = syncListingEmails({ dryRun });
  } catch (error) {
    result = { ok: false, error: error.message };
  }
  return jsonOutput(result);
}

function syncListingEmails(options) {
  const dryRun = Boolean(options?.dryRun);
  const source = getOrCreateLabel(SOURCE_LABEL);
  const processed = getOrCreateLabel(PROCESSED_LABEL);
  const review = getOrCreateLabel(REVIEW_LABEL);
  const threads = source.getThreads(0, 50);
  const sheet = getSheet();
  const headers = ensureHeaders(sheet);
  const existing = getExistingKeys(sheet, headers);
  const result = {
    ok: true,
    dryRun,
    processedCount: 0,
    createdCount: 0,
    duplicateCount: 0,
    needsReviewCount: 0,
    skippedCount: 0,
    createdItems: [],
    duplicateItems: [],
    reviewItems: []
  };

  threads.forEach((thread) => {
    const messages = thread.getMessages();
    const message = messages[messages.length - 1];
    const parsed = parseListingEmail(message);
    result.processedCount += 1;

    if (!parsed.ok) {
      result.needsReviewCount += 1;
      result.reviewItems.push({ subject: message.getSubject(), messageId: message.getId(), reason: parsed.reason });
      if (!dryRun) thread.addLabel(review);
      return;
    }

    const duplicateKey = buildDuplicateKey(parsed.item);
    const sourceKey = `EMAIL:${message.getId()}`;

    if (existing.has(sourceKey) || existing.has(duplicateKey)) {
      result.duplicateCount += 1;
      result.duplicateItems.push({
        subject: message.getSubject(),
        messageId: message.getId(),
        duplicateKey,
        address: parsed.item.propertyAddress,
        mlsNumber: parsed.item.mlsNumber,
        listingType: parsed.item.listingType
      });
      if (!dryRun) {
        thread.addLabel(processed);
        thread.removeLabel(source);
      }
      return;
    }

    const id = `MLS-${Utilities.getUuid().slice(0, 8)}`;
    const rowObject = {
      "ID": id,
      "Date Received": formatDate(message.getDate()),
      "Agent Name": parsed.item.agentName,
      "Listing Type": parsed.item.listingType,
      "MLS#": parsed.item.mlsNumber,
      "MLS Link": parsed.item.mlsLink,
      "Property Address": parsed.item.propertyAddress,
      "Price": parsed.item.price,
      "Duplicate Validation": duplicateKey,
      "Status (Workflow)": parsed.item.listingType === "Canceled" ? "Canceled" : "New",
      "Logo Type": getLogoType(parsed.item.price),
      "Graphics Created?": "NO",
      "Posted": "NO",
      "Source Email ID": message.getId(),
      "Source Email Subject": message.getSubject(),
      "Source Email Date": formatDate(message.getDate()),
      "Date Processed": formatDate(new Date())
    };

    result.createdCount += 1;
    result.createdItems.push({
      id,
      address: parsed.item.propertyAddress,
      mlsNumber: parsed.item.mlsNumber,
      listingType: parsed.item.listingType,
      logoType: rowObject["Logo Type"]
    });

    if (!dryRun) {
      sheet.appendRow(objectToRow(headers, rowObject));
      existing.add(sourceKey);
      existing.add(duplicateKey);
      thread.addLabel(processed);
      thread.removeLabel(source);
    }
  });

  return result;
}

function parseListingEmail(message) {
  const subject = message.getSubject() || "";
  const body = stripHtml(message.getBody() || "");
  const text = `${subject}\n${body}`;
  const status = classifyStatus(text);
  if (status.review) return { ok: false, reason: status.reason };

  const mlsNumber = cleanValue(matchFirst(text, [/MLS\s*#?\s*[:\-]?\s*([A-Z0-9]{5,})/i, /MLS Number\s*[:\-]?\s*([A-Z0-9]{5,})/i]));
  const price = cleanValue(matchFirst(text, [/\$\s*([0-9,]{4,})/, /Price\s*[:\-]?\s*\$?\s*([0-9,]+)/i]));
  const agentName = cleanValue(matchFirst(text, [/Agent\s*(?:Name)?\s*[:\-]\s*([^\n]+)/i, /Listing Agent\s*[:\-]\s*([^\n]+)/i, /Agent\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/]));
  const propertyAddress = cleanAddress(matchFirst(text, [
    /Property Address\s*[:\-]\s*([^\n]+)/i,
    /Address\s*[:\-]\s*([^\n]+)/i,
    /\b\d{2,6}\s+[^\n,]+(?:Road|Rd|Street|St|Drive|Dr|Avenue|Ave|Lane|Ln|Circle|Cir|Court|Ct|Way|Trail|Trl|Place|Pl|Boulevard|Blvd)[^\n]*/i
  ]));
  const mlsLink = cleanValue(matchFirst(text, [/(https?:\/\/[^\s]+(?:flexmls|armls|mls|idx)[^\s]*)/i, /(https?:\/\/[^\s]+)/i])) || "";

  if (!propertyAddress || propertyAddress.length < 8) return { ok: false, reason: "Property address could not be parsed safely." };
  if (!status.listingType) return { ok: false, reason: "Unknown listing status." };

  return {
    ok: true,
    item: {
      agentName,
      propertyAddress,
      price,
      listingType: status.listingType,
      mlsNumber,
      mlsLink
    }
  };
}

function classifyStatus(text) {
  const lower = String(text || "").toLowerCase();
  if (/expired|withdrawn/.test(lower)) return { review: true, reason: "Expired or withdrawn listing update." };
  if (/price\s*change|price reduced|price reduction/.test(lower)) return { review: true, reason: "Price change listing update needs review." };
  if (/cancelled|canceled/.test(lower)) return { listingType: "Canceled" };
  if (/coming soon/.test(lower)) return { listingType: "Coming Soon" };
  if (/under contract/.test(lower)) return { listingType: "Under Contract" };
  if (/pending/.test(lower)) return { listingType: "Pending" };
  if (/closed|sold/.test(lower)) return { listingType: "Closed" };
  if (/new listing|just listed/.test(lower)) return { listingType: "New Listing" };
  if (/\bactive\b/.test(lower)) return { listingType: "Active" };
  return { review: true, reason: "Unknown listing status." };
}

function buildDuplicateKey(item) {
  return item.mlsNumber
    ? `MLS:${normalize(item.mlsNumber)}|${item.listingType}`
    : `ADDR:${normalize(item.propertyAddress)}|${item.listingType}|${normalize(item.agentName)}`;
}

function getSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SOCIAL_POSTS_SHEET);
  if (!sheet) throw new Error(`Missing sheet: ${SOCIAL_POSTS_SHEET}`);
  return sheet;
}

function ensureHeaders(sheet) {
  const width = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, width).getValues()[0].map((value) => String(value || "").trim());
  if (!headers.some(Boolean)) {
    sheet.getRange(1, 1, 1, SOCIAL_HEADERS.length).setValues([SOCIAL_HEADERS]);
    return SOCIAL_HEADERS.slice();
  }
  SOCIAL_HEADERS.forEach((header) => { if (!headers.includes(header)) headers.push(header); });
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return headers;
}

function getExistingKeys(sheet, headers) {
  const values = sheet.getDataRange().getValues();
  const keys = new Set();
  const col = (name) => headers.indexOf(name);
  for (let i = 1; i < values.length; i += 1) {
    const row = values[i];
    const emailCol = col("Source Email ID");
    const emailId = emailCol >= 0 ? String(row[emailCol] || "").trim() : "";
    if (emailId) keys.add(`EMAIL:${emailId}`);
    const mls = getRowValue(row, col("MLS#"));
    const type = getRowValue(row, col("Listing Type"));
    const address = getRowValue(row, col("Property Address"));
    const agent = getRowValue(row, col("Agent Name"));
    if (mls && type) keys.add(`MLS:${normalize(mls)}|${type}`);
    if (!mls && address && type) keys.add(`ADDR:${normalize(address)}|${type}|${normalize(agent)}`);
  }
  return keys;
}

function getRowValue(row, index) {
  return index >= 0 ? String(row[index] || "").trim() : "";
}

function objectToRow(headers, object) {
  return headers.map((header) => object[header] || "");
}

function matchFirst(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return (match[1] || match[0]).trim();
  }
  return "";
}

function cleanValue(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function cleanAddress(value) {
  return cleanValue(value).replace(/\s+/g, " ").replace(/[.,;\s]+$/, "");
}

function stripHtml(html) {
  return html
    .replace(/<\/(p|div|tr|li|br)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function formatDate(date) {
  return Utilities.formatDate(date, "America/Phoenix", "yyyy-MM-dd");
}

function getLogoType(price) {
  const number = Number(String(price || "").replace(/[^0-9.]/g, ""));
  return number >= 1000000 ? "Luxury eXp" : "Regular eXp";
}

function getOrCreateLabel(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function jsonOutput(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
