const DEFAULT_BROCHURE_RECIPIENT = "KLeal@navititle.com";

function doPost(event) {
  let result;
  try {
    const payload = JSON.parse(event.postData.contents);
    result = sendLuxuryBrochureRequest(payload);
  } catch (error) {
    result = { ok: false, error: error.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendLuxuryBrochureRequest(payload) {
  const to = String(payload.to || DEFAULT_BROCHURE_RECIPIENT).trim();
  const subject = String(payload.subject || "").trim();
  const body = String(payload.body || "").trim();

  if (!to) throw new Error("Missing recipient email.");
  if (!subject) throw new Error("Missing email subject.");
  if (!body) throw new Error("Missing email body.");

  MailApp.sendEmail({
    to,
    subject,
    body,
    name: "The Jakobov Group"
  });

  return {
    ok: true,
    sentTo: to,
    subject,
    sentAt: new Date().toISOString()
  };
}