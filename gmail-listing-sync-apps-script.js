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
 * Backfill from April 19, 2026: WEB_APP_URL?afterDate=2026-04-19&maxResults=150&dryRun=true
 *
 * FIRST TIME AUTHORIZATION:
 * 1. Paste/save this code in Apps Script.
 * 2. Select authorizeListingEmailSync from the function dropdown.
 * 3. Click Run and approve Gmail + Sheets permissions.
 * 4. Deploy a new Web App version after authorization.
 */
const SPREADSHEET_ID = "1nmdNyzfdG7V3guU7BmghtTaujAun7TDkRyK5WefTJ04";
const SOCIAL_POSTS_SHEET = "Social Post Tasks";
const SOURCE_LABEL = "Listing Updates";
const PROCESSED_LABEL = "Processed Listing Updates";
const REVIEW_LABEL = "Needs Review Listing Updates";
const FLEXMLS_SENDER = "listingupdates@flexmail.flexmls.com";

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

/**
 * Run this manually once in Apps Script to trigger the Google permission screen.
 * It checks Gmail labels and the Social Post Tasks sheet, then returns a short status.
 */
function authorizeListingEmailSync() {
  const source = getOrCreateLabel(SOURCE_LABEL);
  const processed = getOrCreateLabel(PROCESSED_LABEL);
  const review = getOrCreateLabel(REVIEW_LABEL);
  const sheet = getSheet();
  const headers = ensureHeaders(sheet);
  return {
    ok: true,
    message: "Authorization check complete. You can redeploy the Web App.",
    labels: [source.getName(), processed.getName(), review.getName()],
    sheet: sheet.getName(),
    headerCount: headers.length
  };
}

function runEndpoint(event) {
  let result;
  try {
    const dryRun = String(event?.parameter?.dryRun || "").toLowerCase() === "true";
    const afterDate = event?.parameter?.afterDate || "";
    const maxResults = Number(event?.parameter?.maxResults || 50);
    result = syncListingEmails({ dryRun, afterDate, maxResults });
  } catch (error) {
    result = { ok: false, error: error.message };
  }
  return jsonOutput(result);
}

function syncListingEmails(options) {
  const dryRun = Boolean(options?.dryRun);
  const afterDate = options?.afterDate || "";
  const maxResults = Math.min(Math.max(Number(options?.maxResults || 50), 1), 250);
  const source = getOrCreateLabel(SOURCE_LABEL);
  const processed = getOrCreateLabel(PROCESSED_LABEL);
  const review = getOrCreateLabel(REVIEW_LABEL);
  const autoLabelResult = autoLabelListingUpdateEmails({ source, processed, review, afterDate, maxResults, dryRun });
  const threads = getListingThreads(source, afterDate, maxResults);
  const sheet = getSheet();
  const headers = ensureHeaders(sheet);
  const existing = getExistingKeys(sheet, headers);
  const result = {
    ok: true,
    dryRun,
    afterDate: afterDate || "",
    autoLabelCount: autoLabelResult.autoLabelCount,
    autoLabelSkippedCount: autoLabelResult.autoLabelSkippedCount,
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
      const existingMatch = existing.get(sourceKey) || existing.get(duplicateKey);
      const duplicateNote = `Duplicate from Gmail backfill ${formatDate(new Date())}: ${duplicateKey}`;
      result.duplicateCount += 1;
      result.duplicateItems.push({
        subject: message.getSubject(),
        messageId: message.getId(),
        duplicateKey,
        existingRow: existingMatch?.rowNumber || "",
        address: parsed.item.propertyAddress,
        mlsNumber: parsed.item.mlsNumber,
        listingType: parsed.item.listingType
      });
      if (!dryRun) {
        if (existingMatch?.rowNumber) {
          markDuplicateOnExistingRow(sheet, headers, existingMatch.rowNumber, duplicateNote);
        }
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
      "Duplicate Validation": `Unique: ${duplicateKey}`,
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
      existing.set(sourceKey, { rowNumber: sheet.getLastRow() });
      existing.set(duplicateKey, { rowNumber: sheet.getLastRow() });
      thread.addLabel(processed);
      thread.removeLabel(source);
    }
  });

  return result;
}

function autoLabelListingUpdateEmails(options) {
  const source = options.source;
  const processed = options.processed;
  const review = options.review;
  const afterDate = options.afterDate || "";
  const maxResults = options.maxResults || 50;
  const dryRun = Boolean(options.dryRun);
  const threads = getCandidateListingThreads(afterDate, maxResults);
  let autoLabelCount = 0;
  let autoLabelSkippedCount = 0;

  threads.forEach((thread) => {
    const labels = thread.getLabels().map((label) => label.getName());
    const alreadyHandled = labels.includes(SOURCE_LABEL) || labels.includes(PROCESSED_LABEL) || labels.includes(REVIEW_LABEL);
    if (alreadyHandled) {
      autoLabelSkippedCount += 1;
      return;
    }
    if (!isListingUpdateThread(thread)) {
      autoLabelSkippedCount += 1;
      return;
    }
    autoLabelCount += 1;
    if (!dryRun) thread.addLabel(source);
  });

  return { autoLabelCount, autoLabelSkippedCount };
}

function getCandidateListingThreads(afterDate, maxResults) {
  const datePart = afterDate ? ` after:${afterDate.replace(/-/g, "/")}` : " newer_than:30d";
  const query = `from:${FLEXMLS_SENDER}${datePart} -label:"${PROCESSED_LABEL}" -label:"${REVIEW_LABEL}"`;
  return GmailApp.search(query, 0, maxResults);
}

function isListingUpdateThread(thread) {
  const messages = thread.getMessages();
  const message = messages[messages.length - 1];
  const text = `${message.getSubject() || ""}\n${stripHtml(message.getBody() || "")}`;
  const status = classifyStatus(text);
  return Boolean(status.listingType || status.review);
}

function parseListingEmail(message) {
  const subject = message.getSubject() || "";
  const body = stripHtml(message.getBody() || "");
  const text = `${subject}\n${body}`;
  const status = classifyStatus(text);
  if (status.review) return { ok: false, reason: status.reason };

  const mlsNumber = cleanValue(matchFirst(text, [/MLS\s*#?\s*[:\-]?\s*([A-Z0-9]{5,})/i, /MLS Number\s*[:\-]?\s*([A-Z0-9]{5,})/i, /#\s*([0-9]{5,})/]));
  const price = cleanValue(matchFirst(text, [/\$\s*([0-9,]{4,})/, /Price\s*[:\-]?\s*\$?\s*([0-9,]+)/i]));
  const agentName = cleanAgentName(subject, text);
  const propertyAddress = cleanAddress(matchFirst(text, [
    /Property Address\s*[:\-]\s*([^\n]+)/i,
    /Address\s*[:\-]\s*([^\n]+)/i,
    /\b\d{2,6}\s+[^\n,]+(?:Road|Rd|Street|St|Drive|Dr|Avenue|Ave|Lane|Ln|Circle|Cir|Court|Ct|Way|Trail|Trl|Place|Pl|Boulevard|Blvd)[^\n•#]*/i
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
  if (/ucb|under contract-backups|under contract backups/.test(lower)) return { listingType: "Under Contract" };
  if (/under contract/.test(lower)) return { listingType: "Under Contract" };
  if (/pending/.test(lower)) return { listingType: "Pending" };
  if (/closed|sold/.test(lower)) return { listingType: "Closed" };
  if (/new listing|just listed/.test(lower)) return { listingType: "New Listing" };
  if (/\bactive\b/.test(lower)) return { listingType: "Active" };
  return { review: true, reason: "Unknown listing status." };
}

function getListingThreads(sourceLabel, afterDate, maxResults) {
  if (!afterDate) return sourceLabel.getThreads(0, maxResults);
  const gmailDate = afterDate.replace(/-/g, "/");
  const query = `from:listingupdates@flexmail.flexmls.com after:${gmailDate} ("Social Post" OR "Create Post" OR "Listing Update")`;
  return GmailApp.search(query, 0, maxResults);
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
  const keys = new Map();
  const col = (name) => headers.indexOf(name);
  for (let i = 1; i < values.length; i += 1) {
    const row = values[i];
    const rowNumber = i + 1;
    const emailCol = col("Source Email ID");
    const emailId = emailCol >= 0 ? String(row[emailCol] || "").trim() : "";
    if (emailId) keys.set(`EMAIL:${emailId}`, { rowNumber });
    const mls = getRowValue(row, col("MLS#"));
    const type = getRowValue(row, col("Listing Type"));
    const address = getRowValue(row, col("Property Address"));
    const agent = getRowValue(row, col("Agent Name"));
    if (mls && type) keys.set(`MLS:${normalize(mls)}|${type}`, { rowNumber });
    if (!mls && address && type) keys.set(`ADDR:${normalize(address)}|${type}|${normalize(agent)}`, { rowNumber });
  }
  return keys;
}

function markDuplicateOnExistingRow(sheet, headers, rowNumber, duplicateNote) {
  const duplicateCol = headers.indexOf("Duplicate Validation") + 1;
  if (duplicateCol <= 0) return;
  const current = String(sheet.getRange(rowNumber, duplicateCol).getValue() || "").trim();
  const next = current && current.indexOf(duplicateNote) === -1 ? `${current}; ${duplicateNote}` : duplicateNote;
  sheet.getRange(rowNumber, duplicateCol).setValue(next);
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
  return cleanValue(value)
    .replace(/\s+/g, " ")
    .replace(/^(000|900|999)\s+/, "")
    .replace(/^(\d{3})\s+(\d{3,6}\s+)/, "$2")
    .replace(/,\s*,/g, ",")
    .replace(/[.,;\s]+$/, "");
}

function cleanAgentName(subject, text) {
  const fromSubject = String(subject || "").split(/\s[-–]\s/)[0].trim();
  if (fromSubject && !/ari'?s listing/i.test(fromSubject) && !/team listings/i.test(fromSubject)) return fromSubject;
  return cleanValue(matchFirst(text, [/Agent\s*(?:Name)?\s*[:\-]\s*([^\n]+)/i, /Listing Agent\s*[:\-]\s*([^\n]+)/i, /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\s*[-–]\s*Social Post/i]));
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
