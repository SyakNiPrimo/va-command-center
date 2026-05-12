const SPREADSHEET_ID = "1nmdNyzfdG7V3guU7BmghtTaujAun7TDkRyK5WefTJ04";
const ATTENDANCE_SHEET = "Attendance";
const AGENT_ROSTER_SHEET = "Agent Roster";

function doGet(event) {
  let result;
  try {
    const action = String(event?.parameter?.action || event?.parameter?.type || "").trim();
    if (action === "agentRoster") {
      result = getAgentRoster();
    } else {
      result = {
        ok: true,
        message: "Attendance sync endpoint is live. Use ?action=agentRoster to read the Agent Roster tab."
      };
    }
  } catch (error) {
    result = { ok: false, error: error.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(event) {
  let result;
  try {
    const payload = JSON.parse(event.postData.contents);
    result = syncZoomAttendance(payload);
  } catch (error) {
    result = { ok: false, error: error.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAgentRoster() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(AGENT_ROSTER_SHEET);
  if (!sheet) throw new Error(`Missing sheet tab: ${AGENT_ROSTER_SHEET}`);

  const values = sheet.getDataRange().getValues();
  if (!values.length) {
    return { ok: true, sheetName: AGENT_ROSTER_SHEET, count: 0, agents: [] };
  }

  const headers = values[0].map((header) => String(header || "").trim());
  const columnMap = getRosterColumnMap(headers);
  const agents = [];

  for (let row = 1; row < values.length; row += 1) {
    const source = values[row];
    const name = getRosterCell(source, columnMap.name);
    if (!name) continue;
    agents.push({
      name,
      instagram: normalizeInstagramHandle(getRosterCell(source, columnMap.instagram)),
      email: getRosterCell(source, columnMap.email),
      phone: getRosterCell(source, columnMap.phone),
      status: getRosterCell(source, columnMap.status) || "Active"
    });
  }

  return {
    ok: true,
    sheetName: AGENT_ROSTER_SHEET,
    count: agents.length,
    agents
  };
}

function getRosterColumnMap(headers) {
  return {
    name: findHeader(headers, ["agent name", "agent", "name"]),
    instagram: findHeader(headers, ["ig handle", "instagram handle", "instagram", "ig"]),
    email: findHeader(headers, ["email address", "email"]),
    phone: findHeader(headers, ["phone number", "phone", "mobile"]),
    status: findHeader(headers, ["status"])
  };
}

function findHeader(headers, aliases) {
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));
  for (let index = 0; index < normalizedHeaders.length; index += 1) {
    if (aliases.some((alias) => normalizedHeaders[index] === normalizeHeader(alias))) return index;
  }
  return -1;
}

function getRosterCell(row, index) {
  if (index < 0) return "";
  return String(row[index] || "").trim();
}

function normalizeHeader(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeInstagramHandle(value) {
  const handle = String(value || "").trim();
  if (!handle) return "";
  return handle.startsWith("@") ? handle : `@${handle}`;
}

function syncZoomAttendance(payload) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(ATTENDANCE_SHEET);
  const values = sheet.getDataRange().getValues();
  const columns = findAttendanceColumns(values[0], values[1], payload.date);

  if (columns.zoom === -1 || columns.office === -1) {
    throw new Error(`No Zoom and Office columns found for ${payload.date}. Add the date to the Attendance tab first.`);
  }

  const agentRows = new Map();
  for (let row = 2; row < values.length; row += 1) {
    const name = normalizeName(values[row][0]);
    if (name) agentRows.set(name, row + 1);
  }

  const updates = [];
  payload.records.forEach((record) => {
    const row = agentRows.get(normalizeName(record.name));
    if (row) updates.push({ row, zoom: Boolean(record.zoom), office: Boolean(record.office) });
  });

  updates.forEach((update) => {
    sheet.getRange(update.row, columns.zoom + 1).setValue(update.zoom);
    sheet.getRange(update.row, columns.office + 1).setValue(update.office);
  });

  return {
    ok: true,
    date: payload.date,
    meetingType: payload.meetingType,
    updatedRows: updates.length
  };
}

function findAttendanceColumns(dateRow, labelRow, isoDate) {
  const target = normalizeDate(isoDate);
  const columns = { zoom: -1, office: -1 };
  let activeDate = "";

  for (let column = 0; column < dateRow.length; column += 1) {
    const dateValue = normalizeDate(dateRow[column]);
    if (dateValue) activeDate = dateValue;
    const labelValue = String(labelRow[column] || "").trim().toLowerCase();
    if (activeDate === target && labelValue === "zoom") columns.zoom = column;
    if (activeDate === target && labelValue === "office") columns.office = column;
  }

  return columns;
}

function normalizeDate(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, "America/Phoenix", "yyyy-MM-dd");
  }

  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const mdy = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (mdy) {
    const month = mdy[1].padStart(2, "0");
    const day = mdy[2].padStart(2, "0");
    return `${mdy[3]}-${month}-${day}`;
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, "America/Phoenix", "yyyy-MM-dd");
  }

  return text;
}

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}
