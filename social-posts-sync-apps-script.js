/**
 * VA Command Center - Social Post Tasks sync
 *
 * Setup:
 * 1. Open the Task Tracker Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this file into the Apps Script editor.
 * 4. Deploy > New deployment > Web app.
 * 5. Execute as: Me.
 * 6. Who has access: Anyone with the link, or your Workspace users.
 * 7. doGet returns active rows. Add ?includeCompleted=true to return all rows.
 * 8. doPost updates one row by ID with allowed fields only.
 * 9. Copy the Web app URL into app.js as socialPostsSyncUrl.
 */

const SPREADSHEET_ID = "1nmdNyzfdG7V3guU7BmghtTaujAun7TDkRyK5WefTJ04";
const SOCIAL_POSTS_SHEET = "Social Post Tasks";

const REQUIRED_HEADERS = [
  "ID",
  "Date Received",
  "Agent Name",
  "Listing Type",
  "MLS#",
  "MLS Link",
  "Property Address",
  "Price",
  "Bedrooms",
  "Bathrooms",
  "Approximate Square Feet",
  "MLS Description",
  "Duplicate Validation",
  "Status (Workflow)",
  "Logo Type",
  "Agent Headshot Link",
  "Agent Headshot File",
  "Agent Headshot Found",
  "Agent Headshot Confirmed",
  "Agent Name Confirmed",
  "Agent Phone Confirmed",
  "Agent Email Confirmed",
  "Agent Instagram Handle",
  "Agent Instagram Handle Confirmed",
  "Subject",
  "Email Template",
  "Canva Video Link",
  "Graphics Created?",
  "Posted",
  "Date Posted",
  "Graphics Link",
  "Caption",
  "IG Post Link"
];

const TRACKING_HEADERS = [
  "Source Email ID",
  "Source Email Subject",
  "Source Email Date",
  "Date Processed"
];

const UPDATE_HEADERS = REQUIRED_HEADERS.concat(TRACKING_HEADERS).filter((header) => header !== "ID");

function doGet(event) {
  let result;
  try {
    const includeCompleted = String(event?.parameter?.includeCompleted || "").toLowerCase() === "true";
    result = getSocialPostTasks(includeCompleted);
  } catch (error) {
    result = { ok: false, error: error.message };
  }
  return jsonOutput(result);
}

function doPost(event) {
  let result;
  try {
    const payload = JSON.parse(event?.postData?.contents || "{}");
    result = updateSocialPostTask(payload);
  } catch (error) {
    result = { ok: false, error: error.message };
  }
  return jsonOutput(result);
}

function getSocialPostTasks(includeCompleted) {
  const sheet = getSocialPostSheet();
  const headers = ensureHeaders(sheet);
  const values = sheet.getDataRange().getValues();
  const rows = [];

  for (let index = 1; index < values.length; index += 1) {
    const rowObject = rowToObject(headers, values[index]);
    if (!rowObject.ID) continue;
    if (!includeCompleted && isSocialPostComplete(rowObject)) continue;
    rows.push(rowObject);
  }

  return {
    ok: true,
    message: `Loaded ${rows.length} social post task rows.`,
    sheetName: SOCIAL_POSTS_SHEET,
    includeCompleted,
    rows
  };
}

function updateSocialPostTask(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Invalid payload.");
  const id = String(payload.id || payload.ID || "").trim();
  if (!id) throw new Error("Missing ID.");

  const updates = normalizeUpdates(payload.updates || payload);
  const updateKeys = Object.keys(updates);
  if (!updateKeys.length) throw new Error("No allowed fields were provided to update.");

  const sheet = getSocialPostSheet();
  const headers = ensureHeaders(sheet);
  const values = sheet.getDataRange().getValues();
  const idColumn = headers.indexOf("ID");
  if (idColumn === -1) throw new Error("Missing ID column.");

  let targetRow = -1;
  for (let index = 1; index < values.length; index += 1) {
    if (String(values[index][idColumn] || "").trim() === id) {
      targetRow = index + 1;
      break;
    }
  }
  if (targetRow === -1) throw new Error(`Row not found for ID: ${id}`);

  updateKeys.forEach((header) => {
    const column = headers.indexOf(header);
    if (column === -1) return;
    sheet.getRange(targetRow, column + 1).setValue(updates[header]);
  });

  const updatedValues = sheet.getRange(targetRow, 1, 1, headers.length).getValues()[0];
  const updatedRow = rowToObject(headers, updatedValues);

  return {
    ok: true,
    message: `Updated social post task ${id}.`,
    updatedRow,
    updatedFields: updates
  };
}

function getSocialPostSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SOCIAL_POSTS_SHEET);
  if (!sheet) throw new Error(`Missing sheet: ${SOCIAL_POSTS_SHEET}`);
  return sheet;
}

function ensureHeaders(sheet) {
  const neededHeaders = REQUIRED_HEADERS.concat(TRACKING_HEADERS);
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map((header) => String(header || "").trim());

  if (!currentHeaders.some(Boolean)) {
    sheet.getRange(1, 1, 1, neededHeaders.length).setValues([neededHeaders]);
    return neededHeaders.slice();
  }

  const headers = currentHeaders.slice();
  neededHeaders.forEach((header) => {
    if (!headers.includes(header)) headers.push(header);
  });

  if (headers.length !== currentHeaders.length) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return headers;
}

function normalizeUpdates(source) {
  const aliasMap = {
    dateReceived: "Date Received",
    agentName: "Agent Name",
    listingType: "Listing Type",
    mlsNumber: "MLS#",
    mlsLink: "MLS Link",
    propertyAddress: "Property Address",
    graphicsCreated: "Graphics Created?",
    graphicsLink: "Graphics Link",
    posted: "Posted",
    datePosted: "Date Posted",
    igPostLink: "IG Post Link",
    statusWorkflow: "Status (Workflow)",
    duplicateValidation: "Duplicate Validation",
    price: "Price",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    squareFeet: "Approximate Square Feet",
    mlsDescription: "MLS Description",
    logoType: "Logo Type",
    agentHeadshotLink: "Agent Headshot Link",
    agentHeadshotFile: "Agent Headshot File",
    agentHeadshotFound: "Agent Headshot Found",
    agentHeadshotConfirmed: "Agent Headshot Confirmed",
    agentNameConfirmed: "Agent Name Confirmed",
    agentPhoneConfirmed: "Agent Phone Confirmed",
    agentEmailConfirmed: "Agent Email Confirmed",
    agentInstagramHandle: "Agent Instagram Handle",
    agentInstagramHandleConfirmed: "Agent Instagram Handle Confirmed",
    canvaVideoLink: "Canva Video Link",
    caption: "Caption"
  };

  const updates = {};
  Object.keys(source || {}).forEach((key) => {
    const header = aliasMap[key] || key;
    if (!UPDATE_HEADERS.includes(header)) return;
    updates[header] = source[key];
  });
  return updates;
}

function rowToObject(headers, row) {
  const object = {};
  headers.forEach((header, index) => {
    object[header] = formatCell(row[index]);
  });
  return object;
}

function formatCell(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, "America/Phoenix", "yyyy-MM-dd");
  }
  return value === null || value === undefined ? "" : String(value);
}

function isSocialPostComplete(rowObject) {
  return isPostedYes(rowObject.Posted) || String(rowObject["Status (Workflow)"] || "").trim().toLowerCase() === "completed";
}

function isPostedYes(value) {
  return String(value || "").trim().toUpperCase() === "YES";
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
