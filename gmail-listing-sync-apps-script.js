/**
 * VA Command Center - Gmail MLS listing intake
 * Scans Gmail label "Listing Updates" and appends tasks to Social Post Tasks.
 */
const SPREADSHEET_ID = "1nmdNyzfdG7V3guU7BmghtTaujAun7TDkRyK5WefTJ04";
const SOCIAL_POSTS_SHEET = "Social Post Tasks";
const SOURCE_LABEL = "Listing Updates";
const PROCESSED_LABEL = "Processed Listing Updates";
const REVIEW_LABEL = "Needs Review Listing Updates";

const SOCIAL_HEADERS = [
  "ID", "Date Received", "Agent Name", "Listing Type", "MLS#", "MLS Link", "Property Address", "Price",
  "Bedrooms", "Bathrooms", "Approximate Square Feet", "MLS Description", "Duplicate Validation", "Status (Workflow)",
  "Logo Type", "Agent Photo Confirmed", "Agent Name Confirmed", "Agent Phone Confirmed", "Agent Email Confirmed",
  "Agent Instagram Handle", "Subject", "Email Template", "Canva Video Link", "Graphics Created?", "Posted", "Date Posted",
  "Graphics Link", "Caption", "IG Post Link", "Source Email ID", "Source Email Subject", "Source Email Date", "Date Processed"
];

function doGet() {
  let result;
  try {
    result = syncListingEmails();
  } catch (error) {
    result = { ok: false, error: error.message };
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function syncListingEmails() {
  const source = getOrCreateLabel(SOURCE_LABEL);
  const processed = getOrCreateLabel(PROCESSED_LABEL);
  const review = getOrCreateLabel(REVIEW_LABEL);
  const threads = source.getThreads(0, 50);
  const sheet = getSheet();
  const headers = ensureHeaders(sheet);
  const existing = getExistingKeys(sheet, headers);
  const result = { ok: true, processedCount: 0, createdCount: 0, duplicateCount: 0, needsReviewCount: 0, skippedCount: 0, createdItems: [], duplicateItems: [], reviewItems: [] };

  threads.forEach((thread) => {
    const messages = thread.getMessages();
    const message = messages[messages.length - 1];
    const parsed = parseListingEmail(message);
    result.processedCount += 1;

    if (!parsed.ok) {
      thread.addLabel(review);
      result.needsReviewCount += 1;
      result.reviewItems.push({ subject: message.getSubject(), reason: parsed.reason });
      return;
    }

    const duplicateKey = parsed.item.mlsNumber
      ? `MLS:${parsed.item.mlsNumber}|${parsed.item.listingType}`
      : `ADDR:${normalize(parsed.item.propertyAddress)}|${parsed.item.listingType}|${normalize(parsed.item.agentName)}`;
    const sourceKey = `EMAIL:${message.getId()}`;

    if (existing.has(sourceKey) || existing.has(duplicateKey)) {
      thread.addLabel(processed);
      thread.removeLabel(source);
      result.duplicateCount += 1;
      result.duplicateItems.push({ subject: message.getSubject(), duplicateKey });
      return;
    }

    const id = `MLS-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const row = objectToRow(headers, {
      "ID": id,
      "Date Received": formatDate(message.getDate()),
      "Agent Name": parsed.item.agentName,
      "Listing Type": parsed.item.listingType,
      "MLS#": parsed.item.mlsNumber,
      "MLS Link": parsed.item.mlsLink,
      "Property Address": parsed.item.propertyAddress,
      "Price": parsed.item.price,
      "Duplicate Validation": duplicateKey,
      "Status (Workflow)": "New",
      "Logo Type": getLogoType(parsed.item.price),
      "Graphics Created?": "NO",
      "Posted": "NO",
      "Source Email ID": message.getId(),
      "Source Email Subject": message.getSubject(),
      "Source Email Date": formatDate(message.getDate()),
      "Date Processed": formatDate(new Date())
    });
    sheet.appendRow(row);
    existing.add(sourceKey);
    existing.add(duplicateKey);
    thread.addLabel(processed);
    thread.removeLabel(source);
    result.createdCount += 1;
    result.createdItems.push({ id, address: parsed.item.propertyAddress, mlsNumber: parsed.item.mlsNumber, listingType: parsed.item.listingType });
  });

  return result;
}

function parseListingEmail(message) {
  const subject = message.getSubject() || "";
  const body = stripHtml(message.getBody() || "");
  const text = `${subject}\n${body}`;
  const listingType = detectListingType(text);
  if (!listingType) return { ok: false, reason: "Unknown or ignored listing status." };
  const mlsNumber = matchFirst(text, [/MLS\s*#?\s*[:\-]?\s*([A-Z0-9]{5,})/i, /MLS Number\s*[:\-]?\s*([A-Z0-9]{5,})/i]);
  const price = matchFirst(text, [/\$\s*([0-9,]{4,})/, /Price\s*[:\-]?\s*\$?\s*([0-9,]+)/i]);
  const agentName = matchFirst(text, [/Agent\s*(?:Name)?\s*[:\-]\s*([^\n]+)/i, /Listing Agent\s*[:\-]\s*([^\n]+)/i]) || "";
  const propertyAddress = matchFirst(text, [/Property Address\s*[:\-]\s*([^\n]+)/i, /Address\s*[:\-]\s*([^\n]+)/i, /\b\d{2,6}\s+[^\n,]+(?:Road|Rd|Street|St|Drive|Dr|Avenue|Ave|Lane|Ln|Circle|Cir|Court|Ct|Way|Trail|Trl|Place|Pl)[^\n]*/i]);
  const mlsLink = matchFirst(text, [/(https?:\/\/[^\s]+(?:flexmls|armls|mls)[^\s]*)/i, /(https?:\/\/[^\s]+)/i]) || "";
  if (!propertyAddress || propertyAddress.length < 8) return { ok: false, reason: "Property address could not be parsed safely." };
  return { ok: true, item: { agentName, propertyAddress, price, listingType, mlsNumber, mlsLink } };
}

function detectListingType(text) {
  const lower = text.toLowerCase();
  if (/cancelled|canceled|expired|withdrawn|price change/.test(lower)) return "";
  if (/coming soon/.test(lower)) return "Coming Soon";
  if (/under contract/.test(lower)) return "Under Contract";
  if (/pending/.test(lower)) return "Pending";
  if (/closed|sold/.test(lower)) return "Closed";
  if (/new listing|just listed|active/.test(lower)) return "New Listing";
  return "";
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
    const emailId = String(row[col("Source Email ID")] || "").trim();
    if (emailId) keys.add(`EMAIL:${emailId}`);
    const mls = String(row[col("MLS#")] || "").trim();
    const type = String(row[col("Listing Type")] || "").trim();
    const address = String(row[col("Property Address")] || "").trim();
    const agent = String(row[col("Agent Name")] || "").trim();
    if (mls && type) keys.add(`MLS:${mls}|${type}`);
    if (!mls && address && type) keys.add(`ADDR:${normalize(address)}|${type}|${normalize(agent)}`);
  }
  return keys;
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

function stripHtml(html) {
  return html
    .replace(/<\/(p|div|tr|li|br)>/gi, "\n")
    .replace(/<br\s*\/?\>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
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