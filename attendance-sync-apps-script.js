const SPREADSHEET_ID = "1nmdNyzfdG7V3guU7BmghtTaujAun7TDkRyK5WefTJ04";
const ATTENDANCE_SHEET = "Attendance";

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
