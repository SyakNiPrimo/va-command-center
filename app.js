const categories = ["Daily Team Communication", "Social Media Management", "Listing Marketing", "Email Tasks", "Weekly Compliance", "Meeting and Recording", "Operations and Admin"];
const statuses = ["Pending", "In Progress", "Waiting for Ari", "Waiting for Team", "Waiting for Designer", "Needs Review", "Completed", "Blocked"];
const priorities = ["Urgent", "High", "Medium", "Low"];
const attendanceSyncUrl = "https://script.google.com/macros/s/AKfycbzr2BcF1hd9dEx6_dzuw1SZgMF6qppY67Pf4Fh1xJTpwX_DA473GaB5uLkh_u6wl6mPew/exec";
let attendanceSyncTimer = null;
const storeKey = "ariVaDashboard.v1";
const canvaVideoTemplate = { name: "Social Media Video", designId: "DAHI50PL_aY", editUrl: "https://www.canva.com/d/FMNZvq0Nvc1lR44" };
const photoPrepSlots = ["Living Room", "Kitchen", "Dining", "Bedroom", "Bathroom", "Exterior Yard"];
const photoPrepFiles = new Map();
const templates = [
  { title: "Daily Team Meeting and Roleplay", body: "Good morning team! Reminder that we have our Daily Team Meeting and Roleplay today at 8:30 AM Arizona time.\n\nZoom link:\nhttps://zoomwithari.net/" },
  { title: "Tuesday Bowers Weekly Zoom", body: "Good morning team! Reminder that today is Bowers Weekly Zoom at 8:00 AM Arizona time.\n\nZoom link:\nhttp://www.agentxcelhub.com/" },
  { title: "Task Update To Ari", body: "Hi Ari, quick update for today:\n\nCompleted:\n\nIn progress:\n\nWaiting on:\n\nNeed your approval on:" },
  { title: "Graphics Request To Kim", body: "Hi Kim, could you please help create graphics for this listing?\n\nProperty address:\nStatus:\nAgent handle:\nMLS link:\nNeeded graphics:\nCaption ready: Yes or No\nDeadline:" },
  { title: "End Of Day Report", body: "End of day update:\n\nTop completed tasks:\n\nStill in progress:\n\nWaiting for replies:\n\nPriorities for tomorrow:" }
];
const complianceItems = [
  "Brokerage name is visible where required.",
  "Caption includes EXP Realty and The Jakobov Group when needed.",
  "Required hashtags are present: #arizona #RealEstate #TheJakobovGroup.",
  "Caption uses no hyphens or em dashes.",
  "Real estate caption appears before image notes.",
  "Full property address is on the first line.",
  "Status is in all caps.",
  "Exclusively listed by uses only the agent handle and @thejakobovgroup.",
  "Collaborator posts that cannot be edited are noted.",
  "Posts needing updates are converted into tasks."
];
const seedAgents = ["Alijah Thomas", "Angela Sinagoga", "Brandon Uribe", "Catherine Gurevich", "James Mandavia", "Joe Babadzhanov", "Katelyn Bullan", "Katherine Ortmeier", "Kelly Bridges", "Mauricio Vega", "Roxy Rodriguez", "Samuel Negreanu", "Shayna Moos", "Steele Nash", "Stephanie Pieper", "Stephen Baugh", "Svetlana Suleymanov", "Teddy Kieborz"].map((name) => ({ id: `agent-${slug(name)}`, name, note: "" }));
const syncSnapshot = {
  updatedAt: "2026-05-05T14:00:00+08:00",
  gmail: { inboxTotal: 400, unreadTotal: 81, items: [
    { id: "sisu", from: "noreply@sisu.co", subject: "Tasks Due Tuesday May 05, 2026", received: "2026-05-05T13:43:50", snippet: "Due today count: 4. Just Sold Social Media Post tasks.", url: "https://mail.google.com/mail/", suggestedTask: "Review Sisu due today tasks and create social media posts" },
    { id: "flexmls", from: "Ari Jakobov via Flexmls", subject: "Pending listing update", received: "2026-05-05T01:49:40", snippet: "Pending listing update from Flexmls.", url: "https://mail.google.com/mail/", suggestedTask: "Create pending listing social post" }
  ]},
  calendar: [
    { title: "Bowers Weekly Zoom", start: "2026-05-05T23:00:00+08:00", location: "http://www.agentxcelhub.com", url: "https://calendar.google.com/" },
    { title: "Team Meeting & Roleplay", start: "2026-05-06T23:30:00+08:00", location: "https://zoomwithari.net/", url: "https://calendar.google.com/" }
  ],
  drive: [{ title: "Task Tracker", type: "Spreadsheet", updated: "2026-05-05T14:00:00Z", url: "https://docs.google.com/spreadsheets/d/1nmdNyzfdG7V3guU7BmghtTaujAun7TDkRyK5WefTJ04/edit" }]
};
const seedTasks = [
  { title: "Send the correct morning meeting reminder", category: "Daily Team Communication", status: "Pending", priority: "Urgent", due: todayISO(), notes: "Dashboard automatically chooses Daily Team Meeting or Tuesday Bowers Zoom." },
  { title: "Paste morning Zoom link into Read.ai", category: "Meeting and Recording", status: "Pending", priority: "High", due: todayISO(), notes: "Use Zoom link: https://us06web.zoom.us/j/7251527919" },
  { title: "Review social media backlog from December 13, 2025 to present", category: "Social Media Management", status: "Pending", priority: "High", due: "", notes: "Check captions, hashtags, brokerage naming, and collaborator limitations." },
  { title: "Confirm emails needing Ari approval or Kim graphics", category: "Email Tasks", status: "Pending", priority: "Medium", due: todayISO(), notes: "Closed deals, graphics, payments, vendors, Rocket Lister, signage." }
];
let state = loadState();
function slug(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function uid(prefix) { return crypto.randomUUID ? crypto.randomUUID() : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function getArizonaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Phoenix", weekday: "long", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value || "";
  return { weekday: value("weekday"), year: value("year"), month: value("month"), day: value("day"), hour: Number(value("hour")), minute: Number(value("minute")) };
}
function todayArizonaISO(date = new Date()) { const p = getArizonaParts(date); return `${p.year}-${p.month}-${p.day}`; }
function loadState() {
  const saved = localStorage.getItem(storeKey);
  if (saved) return JSON.parse(saved);
  return { tasks: seedTasks.map((task) => ({ ...task, id: uid("task") })), compliance: complianceItems.map((text, index) => ({ id: `compliance-${index}`, text, done: false })), dailyState: { date: todayArizonaISO(), meetingSent: false, whatsappSent: false }, agents: seedAgents, attendanceSessions: [], videoTasks: [{ id: "video-42610-n-22nd-st", address: "42610 N 22ND ST", canvaLink: "", fileName: "42610 N 22ND ST.mp4", status: "Exported MP4" }] };
}
function saveState() { localStorage.setItem(storeKey, JSON.stringify(state)); }
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m]); }
function fillSelect(select, options) { if (!select) return; options.forEach((option) => select.append(new Option(option, option))); }
function showToast(message) { const toast = document.querySelector("#toast"); if (!toast) return; toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); }
function copyText(text) { navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard."), () => showToast("Copy failed. Select and copy manually.")); }
function getMeetingInfo(date = new Date()) {
  const tuesday = getArizonaParts(date).weekday === "Tuesday";
  return tuesday ? { type: "Bowers Weekly Zoom", title: "Tuesday Bowers Weekly Zoom", description: "Tuesday uses Bowers Weekly Zoom instead of Daily Team Meeting and Roleplay.", meetingTime: "8:00 AM AZ", reminderTime: "7:45 AM AZ", reminderMinutes: 465, message: templates[1].body } : { type: "Daily Team Meeting", title: "Daily Team Meeting and Roleplay", description: "Send this reminder every day except Tuesday.", meetingTime: "8:30 AM AZ", reminderTime: "8:15 AM AZ", reminderMinutes: 495, message: templates[0].body };
}
function getMeetingInfoForArizonaDate(dateString) { return getMeetingInfo(new Date(`${dateString}T12:00:00Z`)); }
function isReminderReady(date = new Date()) { const p = getArizonaParts(date); return p.hour * 60 + p.minute >= getMeetingInfo(date).reminderMinutes; }
function setDailyState() {
  state.tasks = state.tasks.filter((task) => task.category !== "Follow Up Boss");
  if (!state.tasks.some((task) => task.title === "Paste morning Zoom link into Read.ai")) state.tasks.unshift({ id: uid("task"), title: "Paste morning Zoom link into Read.ai", category: "Meeting and Recording", status: "Pending", priority: "High", due: todayISO(), notes: "Use Zoom link: https://us06web.zoom.us/j/7251527919" });
  if (state.dailyState.date !== todayArizonaISO()) state.dailyState = { date: todayArizonaISO(), meetingSent: false, whatsappSent: false };
  if (!Array.isArray(state.agents) || state.agents.length < 3) state.agents = seedAgents;
  seedAgents.forEach((agent) => { if (!state.agents.some((item) => item.id === agent.id || item.name === agent.name)) state.agents.push(agent); });
  if (!Array.isArray(state.attendanceSessions)) state.attendanceSessions = [];
  if (!Array.isArray(state.videoTasks)) state.videoTasks = [];
  saveState();
}
function renderMeeting() {
  const info = getMeetingInfo();
  document.querySelector("#todayLabel").textContent = new Date().toLocaleDateString(undefined, { timeZone: "America/Phoenix", weekday: "long", month: "long", day: "numeric", year: "numeric" }) + " Arizona time";
  document.querySelector("#meetingType").textContent = state.dailyState.meetingSent ? `${info.type} sent` : info.type;
  document.querySelector("#meetingTitle").textContent = info.title;
  document.querySelector("#meetingTime").textContent = info.meetingTime;
  document.querySelector("#meetingDescription").textContent = info.description;
  document.querySelector("#meetingMessage").value = info.message;
  const ready = isReminderReady();
  const status = document.querySelector("#whatsappReminderStatus");
  const text = document.querySelector("#whatsappReminderText");
  const button = document.querySelector("#markWhatsappSent");
  document.querySelector(".meeting-panel")?.classList.toggle("ready", ready && !state.dailyState.whatsappSent);
  button.classList.toggle("done", state.dailyState.whatsappSent);
  button.textContent = state.dailyState.whatsappSent ? "WhatsApp Sent" : "Mark WhatsApp Sent";
  status.textContent = state.dailyState.whatsappSent ? "Sent Today" : ready ? "Ready Now" : "Upcoming";
  text.textContent = state.dailyState.whatsappSent ? `WhatsApp reminder for ${info.type} has been marked sent today.` : ready ? `It is ${info.reminderTime} or later. Copy and send the ${info.type} reminder in WhatsApp.` : `At ${info.reminderTime}, copy and send the ${info.type} reminder in WhatsApp.`;
}
function priorityRank(priority) { return priorities.indexOf(priority); }
function renderFocus() {
  const active = state.tasks.filter((task) => task.status !== "Completed").sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  const top = active.filter((task) => task.due === todayISO() || ["Urgent", "High"].includes(task.priority)).slice(0, 3);
  document.querySelector("#topTasks").innerHTML = (top.length ? top : active.slice(0, 3)).map((task) => `<li>${escapeHTML(task.title)} (${escapeHTML(task.category)})</li>`).join("") || "<li>No active tasks right now.</li>";
  const waiting = state.tasks.filter((task) => task.status.startsWith("Waiting"));
  document.querySelector("#waitingList").innerHTML = waiting.map((task) => `<li>${escapeHTML(task.title)} (${escapeHTML(task.status)})</li>`).join("") || "<li>No waiting items right now.</li>";
}
function renderTasks() {
  const category = document.querySelector("#categoryFilter").value;
  const status = document.querySelector("#statusFilter").value;
  const filtered = state.tasks.filter((task) => (category === "All" || task.category === category) && (status === "All" || task.status === status));
  document.querySelector("#taskList").innerHTML = filtered.length ? `<table class="work-table"><thead><tr><th>Task</th><th>Category</th><th>Status</th><th>Priority</th><th>Due</th><th>Actions</th></tr></thead><tbody>${filtered.map((task) => `<tr><td><strong>${escapeHTML(task.title)}</strong><span>${escapeHTML(task.notes || "No notes added.")}</span></td><td><span class="chip">${escapeHTML(task.category)}</span></td><td><span class="status-pill">${escapeHTML(task.status)}</span></td><td><span class="priority-pill priority-${escapeHTML(task.priority)}">${escapeHTML(task.priority)}</span></td><td>${task.due || "No date"}</td><td><div class="table-actions"><button data-action="progress" data-id="${task.id}">Start</button><button data-action="review" data-id="${task.id}">Review</button><button data-action="complete" data-id="${task.id}">Done</button><button class="quiet" data-action="delete" data-id="${task.id}">Delete</button></div></td></tr>`).join("")}</tbody></table>` : `<div class="empty-state">No tasks match these filters.</div>`;
}
function formatDateTime(value) { return new Date(value).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
function renderSync() {
  document.querySelector("#syncUpdated").textContent = `Last pulled: ${formatDateTime(syncSnapshot.updatedAt)}. This is a dashboard snapshot, not live browser sync.`;
  document.querySelector("#syncSummary").innerHTML = `<div class="metric"><span>Inbox Total</span><strong>${syncSnapshot.gmail.inboxTotal}</strong></div><div class="metric"><span>Unread</span><strong>${syncSnapshot.gmail.unreadTotal}</strong></div><div class="metric"><span>Inbox Items Shown</span><strong>${syncSnapshot.gmail.items.length}</strong></div><div class="metric"><span>Upcoming Events</span><strong>${syncSnapshot.calendar.length}</strong></div>`;
  document.querySelector("#syncEmails").innerHTML = syncSnapshot.gmail.items.map((email) => `<div class="sync-item"><a href="${email.url}" target="_blank">${escapeHTML(email.subject)}</a><p class="small-muted">${escapeHTML(email.from)} | ${escapeHTML(formatDateTime(email.received))}</p><p class="small-muted">${escapeHTML(email.snippet)}</p><button data-sync-task="${email.id}">Add Task</button></div>`).join("");
  document.querySelector("#syncEvents").innerHTML = syncSnapshot.calendar.map((event) => `<div class="sync-item"><a href="${event.url}" target="_blank">${escapeHTML(event.title)}</a><p class="small-muted">${escapeHTML(formatDateTime(event.start))}</p><p class="small-muted">${escapeHTML(event.location || "No location added.")}</p></div>`).join("");
  document.querySelector("#syncDrive").innerHTML = syncSnapshot.drive.map((file) => `<div class="sync-item"><a href="${file.url}" target="_blank">${escapeHTML(file.title)}</a><p class="small-muted">${escapeHTML(file.type)} | Updated ${escapeHTML(formatDateTime(file.updated))}</p></div>`).join("");
}
function createAttendanceSession(date = document.querySelector("#attendanceDate")?.value || todayArizonaISO()) {
  const info = getMeetingInfoForArizonaDate(date);
  let session = state.attendanceSessions.find((item) => item.date === date);
  if (!session) state.attendanceSessions.unshift(session = { id: uid("attendance"), date, meetingType: info.type, meetingTime: info.meetingTime, records: [] });
  state.agents.forEach((agent) => { if (!session.records.some((record) => record.agentId === agent.id)) session.records.push({ agentId: agent.id, zoom: false, office: false, note: "" }); });
  session.meetingType = info.type; session.meetingTime = info.meetingTime; saveState(); renderAttendance(); return session;
}
function getAttendanceSyncPayload() {
  const selectedDate = document.querySelector("#attendanceDate")?.value;
  const session = state.attendanceSessions.find((item) => item.date === selectedDate) || state.attendanceSessions[0];
  if (!session) return null;
  return { date: session.date, meetingType: session.meetingType, meetingTime: session.meetingTime, records: state.agents.map((agent) => { const record = session.records.find((entry) => entry.agentId === agent.id); return { name: agent.name, zoom: Boolean(record?.zoom ?? record?.attended), office: Boolean(record?.office) }; }) };
}
async function syncAttendanceToSheet() {
  const payload = getAttendanceSyncPayload();
  if (!payload) return showToast("Start an attendance session first.");
  const response = await fetch(attendanceSyncUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "Attendance sync failed.");
  showToast(`Synced ${result.updatedRows} attendance rows.`);
}
function queueAttendanceSync() {
  const status = document.querySelector("#attendanceSyncStatus");
  if (status) status.textContent = "Sync status: saving to Task Tracker...";
  clearTimeout(attendanceSyncTimer);
  attendanceSyncTimer = setTimeout(() => syncAttendanceToSheet().then(() => { if (status) status.textContent = "Sync status: synced to Task Tracker."; }).catch(() => { if (status) status.textContent = "Sync status: sync failed."; }), 600);
}
function renderAttendance() {
  const dateInput = document.querySelector("#attendanceDate");
  if (dateInput && !dateInput.value) dateInput.value = todayArizonaISO();
  const selectedDate = dateInput?.value || todayArizonaISO();
  const session = state.attendanceSessions.find((item) => item.date === selectedDate);
  document.querySelector("#attendanceSyncStatus").textContent = "Sync status: ready to update Task Tracker.";
  if (!session) { document.querySelector("#attendanceSessions").innerHTML = `<div class="empty-state">No attendance session for ${escapeHTML(selectedDate)}. Click Load Date to start this day.</div>`; return; }
  const rows = state.agents.map((agent) => { const record = session.records.find((entry) => entry.agentId === agent.id) || {}; return `<tr><td><strong>${escapeHTML(agent.name)}</strong></td><td class="attendance-check-cell"><input type="checkbox" data-attendance-check="zoom" data-session="${session.id}" data-agent="${agent.id}" ${record.zoom || record.attended ? "checked" : ""}></td><td class="attendance-check-cell"><input type="checkbox" data-attendance-check="office" data-session="${session.id}" data-agent="${agent.id}" ${record.office ? "checked" : ""}></td></tr>`; }).join("");
  document.querySelector("#attendanceSessions").innerHTML = `<table class="work-table attendance-table"><thead><tr class="date-row"><th>${escapeHTML(session.date)} | ${escapeHTML(session.meetingType)} | ${escapeHTML(session.meetingTime)}</th><th>Zoom</th><th>Office</th></tr><tr><th>Agent</th><th>Zoom</th><th>Office</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function renderCompliance() { document.querySelector("#complianceList").innerHTML = state.compliance.map((item) => `<label class="check-item"><input type="checkbox" data-compliance="${item.id}" ${item.done ? "checked" : ""}> <span>${escapeHTML(item.text)}</span></label>`).join(""); }
function taskList(tasks, fallback) { return tasks.length ? tasks.map((task) => `- ${task.title}`).join("\n") : fallback; }
function buildEndOfDayReport() {
  const session = state.attendanceSessions[0];
  const zoom = session ? state.agents.filter((agent) => session.records.find((record) => record.agentId === agent.id)?.zoom) : [];
  const office = session ? state.agents.filter((agent) => session.records.find((record) => record.agentId === agent.id)?.office) : [];
  const open = state.tasks.filter((task) => task.status !== "Completed").sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  return `End of day update | ${todayArizonaISO()} Arizona time\n\nCompleted today:\n${taskList(state.tasks.filter((task) => task.status === "Completed"), "- No completed tasks marked yet.")}\n\nStill in progress:\n${taskList(state.tasks.filter((task) => ["Pending", "In Progress", "Needs Review", "Blocked"].includes(task.status)), "- No active tasks marked right now.")}\n\nWaiting for replies:\n${taskList(state.tasks.filter((task) => task.status.startsWith("Waiting")), "- No waiting items marked right now.")}\n\nMorning Zoom attendance:\n${session ? `- ${zoom.length} agents marked in Zoom for ${session.meetingType}.` : "- No attendance session started today."}\n${zoom.map((agent) => `- ${agent.name}`).join("\n")}\n\nOffice attendance:\n${session ? `- ${office.length} agents marked in office.` : "- No attendance session started today."}\n${office.map((agent) => `- ${agent.name}`).join("\n")}\n\nTop priorities for tomorrow:\n${taskList(open.slice(0, 3), "- No open priorities selected yet.")}\n`;
}
function renderEndOfDayReport() { document.querySelector("#eodReport").value = buildEndOfDayReport(); }
function renderVideoTasks() { document.querySelector("#videoTaskList").innerHTML = state.videoTasks.length ? `<table class="work-table video-table"><thead><tr><th>Property</th><th>Canva</th><th>MP4 File</th><th>Status</th><th>Actions</th></tr></thead><tbody>${state.videoTasks.map((task) => `<tr><td><strong>${escapeHTML(task.address)}</strong></td><td>${task.canvaLink ? `<a href="${escapeHTML(task.canvaLink)}" target="_blank">Open Canva</a>` : "No Canva link"}</td><td>${escapeHTML(task.fileName || "No file added")}</td><td><span class="status-pill">${escapeHTML(task.status)}</span></td><td><div class="table-actions"><button data-video-action="ready" data-id="${task.id}">Ready</button><button data-video-action="posted" data-id="${task.id}">Posted</button></div></td></tr>`).join("")}</tbody></table>` : `<div class="empty-state">No Canva video tasks yet.</div>`; }
function renderPhotoPrepSlots() { document.querySelector("#photoPrepSlots").innerHTML = photoPrepSlots.map((slot) => `<article class="photo-slot"><div><strong>${escapeHTML(slot)}</strong><span class="section-note">Upload one photo</span></div><input type="file" accept="image/*" data-photo-input="${escapeHTML(slot)}"><div class="photo-output" data-photo-output="${escapeHTML(slot)}"><span>No image generated yet.</span></div><button type="button" data-photo-generate="${escapeHTML(slot)}">Generate</button></article>`).join(""); }
function readImageFile(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = reader.result; }; reader.onerror = reject; reader.readAsDataURL(file); }); }
function drawCover(ctx, img, w, h) { const s = Math.max(w / img.width, h / img.height); ctx.drawImage(img, (w - img.width * s) / 2, (h - img.height * s) / 2, img.width * s, img.height * s); }
async function generatePhotoSlot(slot) {
  const file = photoPrepFiles.get(slot); const output = document.querySelector(`[data-photo-output="${CSS.escape(slot)}"]`);
  if (!file || !output) return showToast(`Add the ${slot} photo first.`);
  output.innerHTML = "<span>Generating...</span>";
  const image = await readImageFile(file); const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1350; const ctx = canvas.getContext("2d");
  ctx.filter = "blur(30px) brightness(0.82)"; drawCover(ctx, image, canvas.width, canvas.height); ctx.filter = "none"; ctx.fillStyle = "rgba(17,24,39,.10)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  let dw = canvas.width, dh = image.height * (dw / image.width); if (dh > 850) { dh = 850; dw = image.width * (dh / image.height); } ctx.drawImage(image, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92); const fileName = `${slug(slot)}-instagram.jpg`; output.innerHTML = `<img src="${dataUrl}" alt="${escapeHTML(slot)} Instagram preview"><a class="download-link" href="${dataUrl}" download="${fileName}">Download JPG</a>`;
}
function renderTemplates() { document.querySelector("#templateList").innerHTML = templates.map((template, i) => `<article class="work-card"><h3>${escapeHTML(template.title)}</h3><textarea readonly>${escapeHTML(template.body)}</textarea><button data-template="${i}">Copy Template</button></article>`).join(""); }
function renderCategories() { document.querySelector("#categoryChips").innerHTML = categories.map((category) => `<span class="chip">${escapeHTML(category)}</span>`).join(""); }
function buildCaption({ address, status, agent, details }) { return `${address}\n${status}\n\nEXP Realty and The Jakobov Group proudly presents ${details.replace(/[—–-]/g, ",").trim()}\n\nExclusively listed by ${agent} and @thejakobovgroup\n\n#arizona #RealEstate #TheJakobovGroup`; }
async function callCanvaApi(path, options = {}) { const response = await fetch(`http://127.0.0.1:8787${path}`, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } }); const data = await response.json(); if (!response.ok || data.ok === false) throw new Error(data.error || "Canva API request failed."); return data; }
function showCanvaApiStatus(value) { const status = document.querySelector("#canvaApiStatus"); if (status) status.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2); }
function renderAll() { setDailyState(); renderMeeting(); renderFocus(); renderTasks(); renderSync(); renderAttendance(); renderCompliance(); renderEndOfDayReport(); renderVideoTasks(); renderPhotoPrepSlots(); renderTemplates(); renderCategories(); }
function initControls() { fillSelect(document.querySelector("#taskCategory"), categories); fillSelect(document.querySelector("#taskStatus"), statuses); fillSelect(document.querySelector("#taskPriority"), priorities); fillSelect(document.querySelector("#categoryFilter"), categories); fillSelect(document.querySelector("#statusFilter"), statuses); }
document.addEventListener("DOMContentLoaded", () => {
  initControls(); const openVideoTemplateLink = document.querySelector("#openVideoTemplateLink"); if (openVideoTemplateLink) openVideoTemplateLink.href = canvaVideoTemplate.editUrl; renderAll(); setInterval(renderMeeting, 30000);
  document.querySelector("#copyMeetingBtn").addEventListener("click", () => copyText(getMeetingInfo().message));
  document.querySelector("#copyWhatsappBtn").addEventListener("click", () => copyText(getMeetingInfo().message));
  document.querySelector("#markWhatsappSent").addEventListener("click", () => { state.dailyState = { ...state.dailyState, date: todayArizonaISO(), whatsappSent: true }; saveState(); renderMeeting(); showToast("WhatsApp reminder marked sent for today."); });
  document.querySelector("#resetDailyBtn").addEventListener("click", () => { state.dailyState = { date: todayArizonaISO(), meetingSent: false, whatsappSent: false }; saveState(); renderAll(); showToast("Daily state reset."); });
  document.querySelector("#taskForm").addEventListener("submit", (event) => { event.preventDefault(); state.tasks.unshift({ id: uid("task"), title: document.querySelector("#taskTitle").value.trim(), category: document.querySelector("#taskCategory").value, status: document.querySelector("#taskStatus").value, priority: document.querySelector("#taskPriority").value, due: document.querySelector("#taskDue").value, notes: document.querySelector("#taskNotes").value.trim() }); event.target.reset(); saveState(); renderAll(); showToast("Task added."); });
  document.querySelector("#taskList").addEventListener("click", (event) => { const button = event.target.closest("button"); if (!button) return; const task = state.tasks.find((item) => item.id === button.dataset.id); if (!task) return; if (button.dataset.action === "progress") task.status = "In Progress"; if (button.dataset.action === "review") task.status = "Needs Review"; if (button.dataset.action === "complete") task.status = "Completed"; if (button.dataset.action === "delete") state.tasks = state.tasks.filter((item) => item.id !== task.id); saveState(); renderAll(); });
  document.querySelector("#syncEmails").addEventListener("click", (event) => { const button = event.target.closest("button[data-sync-task]"); if (!button) return; const email = syncSnapshot.gmail.items.find((item) => item.id === button.dataset.syncTask); if (!email) return; state.tasks.unshift({ id: uid("task"), title: email.suggestedTask, category: email.from.includes("Flexmls") ? "Listing Marketing" : "Social Media Management", status: "Pending", priority: email.from.includes("Flexmls") ? "High" : "Medium", due: todayISO(), notes: `From Gmail: ${email.subject}. ${email.snippet}` }); saveState(); renderAll(); showToast("Gmail item added as a task."); });
  document.querySelector("#importSyncTasksBtn").addEventListener("click", () => { syncSnapshot.gmail.items.forEach((email) => state.tasks.unshift({ id: uid("task"), title: email.suggestedTask, category: email.from.includes("Flexmls") ? "Listing Marketing" : "Social Media Management", status: "Pending", priority: "Medium", due: todayISO(), notes: `From Gmail: ${email.subject}. ${email.snippet}` })); saveState(); renderAll(); showToast("Suggested tasks added."); });
  document.querySelector("#agentForm").addEventListener("submit", (event) => { event.preventDefault(); state.agents.push({ id: uid("agent"), name: document.querySelector("#agentName").value.trim(), note: document.querySelector("#agentNote").value.trim() }); event.target.reset(); saveState(); renderAttendance(); showToast("Agent added to roster."); });
  document.querySelector("#addAttendanceSessionBtn").addEventListener("click", () => { createAttendanceSession(); showToast("Attendance date loaded."); });
  document.querySelector("#attendanceDate").addEventListener("change", renderAttendance);
  document.querySelector("#syncAttendanceBtn").addEventListener("click", () => syncAttendanceToSheet().catch(() => showToast("Attendance sync failed.")));
  document.querySelector("#attendanceSessions").addEventListener("click", (event) => { const checkbox = event.target.closest("input[data-attendance-check]"); if (!checkbox) return; const session = state.attendanceSessions.find((item) => item.id === checkbox.dataset.session); if (!session) return; let record = session.records.find((item) => item.agentId === checkbox.dataset.agent); if (!record) session.records.push(record = { agentId: checkbox.dataset.agent, zoom: false, office: false, note: "" }); if (checkbox.dataset.attendanceCheck === "office") record.office = checkbox.checked; else { record.zoom = checkbox.checked; record.attended = checkbox.checked; } saveState(); renderAttendance(); queueAttendanceSync(); });
  document.querySelector("#categoryFilter").addEventListener("change", renderTasks); document.querySelector("#statusFilter").addEventListener("change", renderTasks);
  document.querySelector("#complianceList").addEventListener("change", (event) => { const checkbox = event.target.closest("input[type='checkbox']"); if (!checkbox) return; const item = state.compliance.find((entry) => entry.id === checkbox.dataset.compliance); if (item) item.done = checkbox.checked; saveState(); });
  document.querySelector("#resetComplianceBtn").addEventListener("click", () => { state.compliance = state.compliance.map((item) => ({ ...item, done: false })); saveState(); renderCompliance(); showToast("Compliance checklist reset."); });
  document.querySelector("#refreshEodBtn").addEventListener("click", () => { renderEndOfDayReport(); showToast("End of day report regenerated."); }); document.querySelector("#copyEodBtn").addEventListener("click", () => { renderEndOfDayReport(); copyText(document.querySelector("#eodReport").value); });
  document.querySelector("#captionForm").addEventListener("submit", (event) => { event.preventDefault(); document.querySelector("#captionOutput").value = buildCaption({ address: document.querySelector("#captionAddress").value.trim(), status: document.querySelector("#captionStatus").value, agent: document.querySelector("#captionAgent").value.trim(), details: document.querySelector("#captionDetails").value.trim() }); });
  document.querySelector("#useVideoTemplateBtn").addEventListener("click", () => { document.querySelector("#videoCanvaLink").value = canvaVideoTemplate.editUrl; showToast("Canva template added."); });
  document.querySelector("#addVideoTaskBtn").addEventListener("click", () => { const address = document.querySelector("#videoAddress").value.trim(); if (!address) return showToast("Add a property address first."); state.videoTasks.unshift({ id: uid("video"), address, canvaLink: document.querySelector("#videoCanvaLink").value.trim(), fileName: document.querySelector("#videoFileName").value.trim(), status: document.querySelector("#videoStatus").value }); document.querySelector("#videoTaskForm").reset(); saveState(); renderVideoTasks(); showToast("Canva video task added."); });
  document.querySelector("#videoTaskList").addEventListener("click", (event) => { const button = event.target.closest("button[data-video-action]"); if (!button) return; const task = state.videoTasks.find((item) => item.id === button.dataset.id); if (!task) return; task.status = button.dataset.videoAction === "posted" ? "Posted" : "Ready To Post"; saveState(); renderVideoTasks(); });
  document.querySelector("#photoPrepSlots").addEventListener("change", (event) => { const input = event.target.closest("input[data-photo-input]"); if (!input || !input.files.length) return; photoPrepFiles.set(input.dataset.photoInput, input.files[0]); document.querySelector(`[data-photo-output="${CSS.escape(input.dataset.photoInput)}"]`).innerHTML = `<span>${escapeHTML(input.files[0].name)} selected.</span>`; });
  document.querySelector("#photoPrepSlots").addEventListener("click", (event) => { const button = event.target.closest("button[data-photo-generate]"); if (button) generatePhotoSlot(button.dataset.photoGenerate).catch(() => showToast("Photo generation failed.")); });
  document.querySelector("#generatePhotoPrepBtn").addEventListener("click", () => photoPrepSlots.forEach((slot) => generatePhotoSlot(slot).catch(() => showToast("Photo generation failed."))));
  document.querySelector("#templateList").addEventListener("click", (event) => { const button = event.target.closest("button[data-template]"); if (button) copyText(templates[Number(button.dataset.template)].body); });
  document.querySelector("#checkCanvaApiBtn").addEventListener("click", async () => { showCanvaApiStatus("Checking Canva API..."); try { const status = await callCanvaApi("/api/canva/status"); const login = await callCanvaApi("/api/canva/login-url"); showCanvaApiStatus({ ...status, loginUrl: login.url }); } catch (error) { showCanvaApiStatus(`Could not reach Canva API server.\n\n${error.message}`); } });
  document.querySelector("#exportCanvaVideoBtn").addEventListener("click", async () => { showCanvaApiStatus("Starting Canva MP4 export. This can take a minute..."); try { const result = await callCanvaApi("/api/canva/export", { method: "POST", body: JSON.stringify({ designId: canvaVideoTemplate.designId, title: "social-media-video" }) }); showCanvaApiStatus(result); showToast("Canva MP4 export finished."); } catch (error) { showCanvaApiStatus(`Canva export failed.\n\n${error.message}`); } });
  document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => { document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active")); document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active")); tab.classList.add("active"); document.querySelector(`#${tab.dataset.tab}`).classList.add("active"); }));
});
