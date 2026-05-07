const categories = [
  "Daily Team Communication",
  "Social Media Management",
  "Listing Marketing",
  "Email Tasks",
  "Weekly Compliance",
  "Meeting and Recording",
  "Operations and Admin"
];

const statuses = [
  "Pending",
  "In Progress",
  "Waiting for Ari",
  "Waiting for Team",
  "Waiting for Designer",
  "Needs Review",
  "Completed",
  "Blocked"
];

const priorities = ["Urgent", "High", "Medium", "Low"];
const attendanceSyncUrl = "https://script.google.com/macros/s/AKfycbzr2BcF1hd9dEx6_dzuw1SZgMF6qppY67Pf4Fh1xJTpwX_DA473GaB5uLkh_u6wl6mPew/exec";
const brochureEmailSendUrl = "https://script.google.com/macros/s/AKfycbzQvm4KYNm9qkTeXXUzTYbuQlL-6aU5FdIGO172ovZZ-HVZfqxALkoY_vhDiguV4qHdAQ/exec";
const brochureEmailCc = "ralph@jakobovgroup.com";
const brochureEmailSignature = "Best,\nBen Tiaga";
let attendanceSyncTimer = null;
const canvaVideoTemplate = {
  name: "Social Media Video",
  designId: "DAHI50PL_aY",
  editUrl: "https://www.canva.com/d/FMNZvq0Nvc1lR44"
};
const photoPrepSlots = [
  "Living Room",
  "Kitchen",
  "Dining",
  "Bedroom",
  "Bathroom",
  "Exterior Yard"
];
const photoPrepFiles = new Map();

const templates = [
  {
    title: "Daily Team Meeting and Roleplay",
    body: "Good morning team! Reminder that we have our Daily Team Meeting and Roleplay today at 8:30 AM Arizona time.\n\nZoom link:\nhttps://zoomwithari.net/"
  },
  {
    title: "Tuesday Bowers Weekly Zoom",
    body: "Good morning team! Reminder that today is Bowers Weekly Zoom at 8:00 AM Arizona time.\n\nZoom link:\nhttp://www.agentxcelhub.com/"
  },
  {
    title: "Task Update To Ari",
    body: "Hi Ari, quick update for today:\n\nCompleted:\n\nIn progress:\n\nWaiting on:\n\nNeed your approval on:"
  },
  {
    title: "Luxury Brochure Request",
    body: "Subject: Luxury Brochure Request - <Address & MLS#>\n\nHi Kim,\n\nI hope you're doing well.\n\nWe would like to request a custom luxury listing brochure for our new listing. We're looking for a polished, high-end design that aligns with our luxury branding and highlights the property in a premium way.\n\nPlease see the details below:\n\nAgent Name:\nAddress:\nMLS #:\nMLS Link:\n\nKindly let us know if you need any additional materials such as photos, property descriptions, floor plans, or specific branding elements. We're happy to provide everything needed to move this forward.\n\nThank you so much, and we're looking forward to seeing the initial draft."
  },
  {
    title: "End Of Day Report",
    body: "End of day update:\n\nTop completed tasks:\n\nStill in progress:\n\nWaiting for replies:\n\nPriorities for tomorrow:"
  }
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

const syncSnapshot = {
  updatedAt: "2026-05-05T14:00:00+08:00",
  gmail: {
    inboxTotal: 400,
    unreadTotal: 81,
    items: [
      {
        id: "19df8617f31c2c80",
        from: "noreply@sisu.co",
        subject: "Tasks Due Tuesday May 05, 2026",
        received: "2026-05-05T13:43:50",
        snippet: "Due today count: 4. Just Sold Social Media Post tasks including 26415 N 160th Dr, Surprise, AZ 85387.",
        url: "https://mail.google.com/mail/#all/19df8617f31c2c80",
        suggestedTask: "Review Sisu due today tasks and create Just Sold social media posts"
      },
      {
        id: "19df5d3a3c5c3487",
        from: "Ari Jakobov via Flexmls",
        subject: "Stephanie Pieper - Sp464",
        received: "2026-05-05T01:49:40",
        snippet: "Pending listing update for 23935 N 80TH Drive, Peoria, AZ 85383. MLS #7019741. Price $1,095,000.",
        url: "https://mail.google.com/mail/#all/19df5d3a3c5c3487",
        suggestedTask: "Create pending social post for 23935 N 80TH Drive"
      },
      {
        id: "19df5743f05f4c98",
        from: "Ari Jakobov via Flexmls",
        subject: "Ari's Listing",
        received: "2026-05-05T00:05:28",
        snippet: "Closed listing update for 35302 W STEINWAY Drive, Arlington, AZ 85322. MLS #7000622. Price $280,000.",
        url: "https://mail.google.com/mail/#all/19df5743f05f4c98",
        suggestedTask: "Create closed listing social post for 35302 W STEINWAY Drive"
      },
      {
        id: "19df567e3eee32f9",
        from: "Ari Jakobov via Flexmls",
        subject: "Ari's Listing",
        received: "2026-05-04T23:51:58",
        snippet: "Pending listing update for 6646 E LONE MOUNTAIN Road, Cave Creek, AZ 85331. MLS #7001068. Price $1,400,000.",
        url: "https://mail.google.com/mail/#all/19df567e3eee32f9",
        suggestedTask: "Create pending social post for 6646 E LONE MOUNTAIN Road"
      },
      {
        id: "19df4313b69b041a",
        from: "Ari Jakobov via Flexmls",
        subject: "Steele Nash - Sn364",
        received: "2026-05-04T18:12:39",
        snippet: "Active listing update for 420 W EARLL Drive 1, Phoenix, AZ 85013. MLS #7000612. Price $159,900.",
        url: "https://mail.google.com/mail/#all/19df4313b69b041a",
        suggestedTask: "Create active listing social post for 420 W EARLL Drive 1"
      }
    ]
  },
  calendar: [
    {
      title: "Bowers Weekly Zoom",
      start: "2026-05-05T23:00:00+08:00",
      end: "2026-05-06T00:00:00+08:00",
      location: "http://www.agentxcelhub.com",
      url: "https://www.google.com/calendar/event?eid=MXFscmFzZ25xOGY4NmJldHFjamNzdG5rZWNfMjAyNjA1MDVUMTUwMDAwWiBiZW5AamFrb2Jvdmdyb3VwLmNvbQ&ctz=Asia/Taipei"
    },
    {
      title: "Team Meeting & Roleplay",
      start: "2026-05-05T23:30:00+08:00",
      end: "2026-05-06T00:00:00+08:00",
      location: "2303 E Wescott Dr, Phoenix, AZ 85024, USA",
      url: "https://www.google.com/calendar/event?eid=MDE3bXNudHM4b2x2cG1nZ2dlcTBxMmMxMHZfMjAyNjA1MDVUMTUzMDAwWiBiZW5AamFrb2Jvdmdyb3VwLmNvbQ&ctz=Asia/Taipei"
    },
    {
      title: "Scottsdale Real Producers Magazine Celebration",
      start: "2026-05-07T02:00:00+08:00",
      end: "2026-05-07T03:30:00+08:00",
      location: "6621 E Doubletree Ranch Rd, Scottsdale, AZ 85259, USA",
      url: "https://www.google.com/calendar/event?eid=MnJtNDc0YzVldTAwMmJlbjZpYmpra2ZkdHAgYmVuQGpha29ib3Zncm91cC5jb20&ctz=Asia/Taipei"
    },
    {
      title: "Team Meeting & Roleplay",
      start: "2026-05-06T23:30:00+08:00",
      end: "2026-05-07T00:00:00+08:00",
      location: "2303 E Wescott Dr, Phoenix, AZ 85024, USA",
      url: "https://www.google.com/calendar/event?eid=MDE3bXNudHM4b2x2cG1nZ2dlcTBxMmMxMHZfMjAyNjA1MDZUMTUzMDAwWiBiZW5AamFrb2Jvdmdyb3VwLmNvbQ&ctz=Asia/Taipei"
    }
  ],
  drive: [
    {
      title: "Swoop It Up - 948 Distributor Contacts Cleaned",
      url: "https://docs.google.com/spreadsheets/d/1CPa4XC8XEHcjTnTPN_Ito0k57M2_DJX0ZpULRLkpCo4",
      type: "Spreadsheet",
      updated: "2026-05-04T19:50:30.934Z"
    },
    {
      title: "ALL licenses Cannabis Companies in CA (1) - with businessPhone and businessOwnerName",
      url: "https://docs.google.com/spreadsheets/d/1aS5oIGqAOPJlNOG20x6zynwDbhT24yMNehTqlIV44YQ",
      type: "Spreadsheet",
      updated: "2026-05-04T19:40:36.502Z"
    },
    {
      title: "Swoop It Up Email Campaign V1",
      url: "https://docs.google.com/document/d/1BjRdY2oe4zDxsJ_sK7bB3Eyw6VgOWQycpG7nn6Lfgvo",
      type: "Document",
      updated: "2026-05-01T21:04:54.632Z"
    },
    {
      title: "Swoop It Up Outreach Tracker",
      url: "https://docs.google.com/spreadsheets/d/1vkGrbNTIC6nleH60UDJBjWa0M1fxICFvNJMXLcpxDpA",
      type: "Spreadsheet",
      updated: "2026-04-29T19:04:36.424Z"
    }
  ]
};

const seedTasks = [
  {
    title: "Send the correct morning meeting reminder",
    category: "Daily Team Communication",
    status: "Pending",
    priority: "Urgent",
    due: todayISO(),
    notes: "Dashboard automatically chooses Daily Team Meeting or Tuesday Bowers Zoom."
  },
  {
    title: "Paste morning Zoom link into Read.ai",
    category: "Meeting and Recording",
    status: "Pending",
    priority: "High",
    due: todayISO(),
    notes: "Use Zoom link: https://us06web.zoom.us/j/7251527919"
  },
  {
    title: "Review social media backlog from December 13, 2025 to present",
    category: "Social Media Management",
    status: "Pending",
    priority: "High",
    due: "",
    notes: "Check captions, hashtags, brokerage naming, and collaborator limitations."
  },
  {
    title: "Confirm emails needing Ari approval or Kim graphics",
    category: "Email Tasks",
    status: "Pending",
    priority: "Medium",
    due: todayISO(),
    notes: "Closed deals, graphics, payments, vendors, Rocket Lister, signage."
  }
];

const seedAgents = [
  { id: "agent-alijah-thomas", name: "Alijah Thomas", note: "" },
  { id: "agent-angela-sinagoga", name: "Angela Sinagoga", note: "" },
  { id: "agent-brandon-uribe", name: "Brandon Uribe", note: "" },
  { id: "agent-catherine-gurevich", name: "Catherine Gurevich", note: "" },
  { id: "agent-james-mandavia", name: "James Mandavia", note: "" },
  { id: "agent-joe-babadzhanov", name: "Joe Babadzhanov", note: "" },
  { id: "agent-katelyn-bullan", name: "Katelyn Bullan", note: "" },
  { id: "agent-katherine-ortmeier", name: "Katherine Ortmeier", note: "" },
  { id: "agent-kelly-bridges", name: "Kelly Bridges", note: "" },
  { id: "agent-mauricio-vega", name: "Mauricio Vega", note: "" },
  { id: "agent-roxy-rodriguez", name: "Roxy Rodriguez", note: "" },
  { id: "agent-samuel-negreanu", name: "Samuel Negreanu", note: "" },
  { id: "agent-shayna-moos", name: "Shayna Moos", note: "" },
  { id: "agent-steele-nash", name: "Steele Nash", note: "" },
  { id: "agent-stephanie-pieper", name: "Stephanie Pieper", note: "" },
  { id: "agent-stephen-baugh", name: "Stephen Baugh", note: "" },
  { id: "agent-svetlana-suleymanov", name: "Svetlana Suleymanov", note: "" },
  { id: "agent-teddy-kieborz", name: "Teddy Kieborz", note: "" }
];

const seedVideoTasks = [
  {
    id: "video-42610-n-22nd-st",
    address: "42610 N 22ND ST",
    canvaLink: "",
    fileName: "42610 N 22ND ST.mp4",
    status: "Exported MP4"
  }
];

const storeKey = "ariVaDashboard.v1";
let state = loadState();

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getArizonaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value || "";
  return {
    weekday: value("weekday"),
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: Number(value("hour")),
    minute: Number(value("minute"))
  };
}

function todayArizonaISO(date = new Date()) {
  const parts = getArizonaParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function loadState() {
  const saved = localStorage.getItem(storeKey);
  if (saved) return JSON.parse(saved);
  return {
    tasks: seedTasks.map((task, index) => ({ ...task, id: crypto.randomUUID ? crypto.randomUUID() : `task-${index}` })),
    compliance: complianceItems.map((text, index) => ({ id: `compliance-${index}`, text, done: false })),
    dailyState: { date: todayArizonaISO(), meetingSent: false, whatsappSent: false },
    agents: seedAgents,
    attendanceSessions: [],
    videoTasks: seedVideoTasks
  };
}

function saveState() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function getMeetingInfo(date = new Date()) {
  const isTuesday = getArizonaParts(date).weekday === "Tuesday";
  return isTuesday
    ? {
        type: "Bowers Weekly Zoom",
        title: "Tuesday Bowers Weekly Zoom",
        description: "Tuesday uses the Bowers Weekly Zoom message instead of the Daily Team Meeting and Roleplay.",
        meetingTime: "8:00 AM AZ",
        reminderTime: "7:45 AM AZ",
        reminderMinutes: 7 * 60 + 45,
        message: templates[1].body
      }
    : {
        type: "Daily Team Meeting",
        title: "Daily Team Meeting and Roleplay",
        description: "Send this reminder every day except Tuesday.",
        meetingTime: "8:30 AM AZ",
        reminderTime: "8:15 AM AZ",
        reminderMinutes: 8 * 60 + 15,
        message: templates[0].body
      };
}

function getMeetingInfoForArizonaDate(dateString) {
  const date = new Date(`${dateString}T12:00:00Z`);
  return getMeetingInfo(date);
}

function fillSelect(select, options) {
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option;
    element.textContent = option;
    select.appendChild(element);
  });
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function setDailyState() {
  state.tasks = state.tasks.filter((task) => task.category !== "Follow Up Boss");
  const readAiTaskExists = state.tasks.some((task) => task.title === "Paste morning Zoom link into Read.ai");
  if (!readAiTaskExists) {
    state.tasks.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : `task-read-ai-${Date.now()}`,
      title: "Paste morning Zoom link into Read.ai",
      category: "Meeting and Recording",
      status: "Pending",
      priority: "High",
      due: todayISO(),
      notes: "Use Zoom link: https://us06web.zoom.us/j/7251527919"
    });
  }
  if (state.dailyState.date !== todayArizonaISO()) {
    state.dailyState = { date: todayArizonaISO(), meetingSent: false, whatsappSent: false };
    saveState();
    return;
  }
  if (typeof state.dailyState.whatsappSent !== "boolean") {
    state.dailyState.whatsappSent = false;
    saveState();
  }
  if (!Array.isArray(state.agents)) state.agents = seedAgents;
  if (state.agents.length <= 2) state.agents = seedAgents;
  seedAgents.forEach((seedAgent) => {
    const exists = state.agents.some((agent) => agent.id === seedAgent.id || agent.name === seedAgent.name);
    if (!exists) state.agents.push(seedAgent);
  });
  state.agents.forEach((agent) => {
    if (agent.note?.startsWith("Pod lead:")) agent.note = "";
  });
  if (!Array.isArray(state.attendanceSessions)) state.attendanceSessions = [];
  if (!Array.isArray(state.videoTasks)) state.videoTasks = seedVideoTasks;
}

function renderMeeting() {
  const info = getMeetingInfo();
  const today = new Date();
  document.querySelector("#todayLabel").textContent = today.toLocaleDateString(undefined, {
    timeZone: "America/Phoenix",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }) + " Arizona time";
  document.querySelector("#meetingType").textContent = state.dailyState.meetingSent ? `${info.type} sent` : info.type;
  document.querySelector("#meetingTitle").textContent = info.title;
  document.querySelector("#meetingTime").textContent = info.meetingTime;
  document.querySelector("#meetingDescription").textContent = info.description;
  document.querySelector("#meetingMessage").value = info.message;
  renderWhatsappReminder();
}

function isWhatsappReminderTime(date = new Date()) {
  const info = getMeetingInfo(date);
  const arizonaNow = getArizonaParts(date);
  const minutesNow = arizonaNow.hour * 60 + arizonaNow.minute;
  return minutesNow >= info.reminderMinutes;
}

function renderWhatsappReminder() {
  const card = document.querySelector(".meeting-panel");
  const status = document.querySelector("#whatsappReminderStatus");
  const text = document.querySelector("#whatsappReminderText");
  const markButton = document.querySelector("#markWhatsappSent");
  const info = getMeetingInfo();
  const ready = isWhatsappReminderTime();

  card.classList.toggle("ready", ready && !state.dailyState.whatsappSent);
  markButton.classList.toggle("done", state.dailyState.whatsappSent);
  markButton.textContent = state.dailyState.whatsappSent ? "WhatsApp Sent" : "Mark WhatsApp Sent";

  if (state.dailyState.whatsappSent) {
    status.textContent = "Sent Today";
    text.textContent = `WhatsApp reminder for ${info.type} has been marked sent today.`;
    return;
  }

  if (ready) {
    status.textContent = "Ready Now";
    text.textContent = `It is ${info.reminderTime} or later. Copy and send the ${info.type} reminder in WhatsApp.`;
    return;
  }

  status.textContent = "Upcoming";
  text.textContent = `At ${info.reminderTime}, copy and send the ${info.type} reminder in WhatsApp.`;
}

function priorityRank(priority) {
  return priorities.indexOf(priority);
}

function renderFocus() {
  const today = todayISO();
  const active = state.tasks
    .filter((task) => task.status !== "Completed")
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));

  const top = active.filter((task) => task.due === today || task.priority === "Urgent" || task.priority === "High").slice(0, 3);
  const topTasks = document.querySelector("#topTasks");
  topTasks.innerHTML = "";
  (top.length ? top : active.slice(0, 3)).forEach((task) => {
    const item = document.createElement("li");
    item.textContent = `${task.title} (${task.category})`;
    topTasks.appendChild(item);
  });

  const waitingList = document.querySelector("#waitingList");
  waitingList.innerHTML = "";
  const waiting = state.tasks.filter((task) => task.status.startsWith("Waiting"));
  if (!waiting.length) {
    const item = document.createElement("li");
    item.textContent = "No waiting items right now.";
    waitingList.appendChild(item);
  }
  waiting.forEach((task) => {
    const item = document.createElement("li");
    item.textContent = `${task.title} (${task.status})`;
    waitingList.appendChild(item);
  });
}

function renderTasks() {
  const categoryFilter = document.querySelector("#categoryFilter").value;
  const statusFilter = document.querySelector("#statusFilter").value;
  const taskList = document.querySelector("#taskList");

  const filtered = state.tasks.filter((task) => {
    const categoryMatch = categoryFilter === "All" || task.category === categoryFilter;
    const statusMatch = statusFilter === "All" || task.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  if (!filtered.length) {
    taskList.innerHTML = `<div class="empty-state">No tasks match these filters.</div>`;
    return;
  }

  const rows = filtered.map((task) => `
    <tr>
      <td>
        <strong>${escapeHTML(task.title)}</strong>
        <span>${escapeHTML(task.notes || "No notes added.")}</span>
      </td>
      <td><span class="chip">${escapeHTML(task.category)}</span></td>
      <td><span class="status-pill">${escapeHTML(task.status)}</span></td>
      <td><span class="priority-pill priority-${escapeHTML(task.priority)}">${escapeHTML(task.priority)}</span></td>
      <td>${task.due ? escapeHTML(task.due) : "No date"}</td>
      <td>
        <div class="table-actions">
          <button data-action="progress" data-id="${task.id}" type="button">Start</button>
          <button data-action="review" data-id="${task.id}" type="button">Review</button>
          <button data-action="complete" data-id="${task.id}" type="button">Done</button>
          <button data-action="delete" data-id="${task.id}" class="quiet" type="button">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  taskList.innerHTML = `
    <table class="work-table">
      <thead>
        <tr>
          <th>Task</th>
          <th>Category</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Due</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function formatDateTime(value) {
  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function renderSync() {
  document.querySelector("#syncUpdated").textContent = `Last pulled: ${formatDateTime(syncSnapshot.updatedAt)}. This is a dashboard snapshot, not live browser sync.`;

  const summary = document.querySelector("#syncSummary");
  summary.innerHTML = `
    <div class="metric"><span>Inbox Total</span><strong>${syncSnapshot.gmail.inboxTotal}</strong></div>
    <div class="metric"><span>Unread</span><strong>${syncSnapshot.gmail.unreadTotal}</strong></div>
    <div class="metric"><span>Inbox Items Shown</span><strong>${syncSnapshot.gmail.items.length}</strong></div>
    <div class="metric"><span>Upcoming Events</span><strong>${syncSnapshot.calendar.length}</strong></div>
  `;

  const emails = document.querySelector("#syncEmails");
  emails.innerHTML = "";
  syncSnapshot.gmail.items.forEach((email) => {
    const item = document.createElement("div");
    item.className = "sync-item";
    item.innerHTML = `
      <a href="${email.url}" target="_blank" rel="noreferrer">${escapeHTML(email.subject)}</a>
      <p class="small-muted">${escapeHTML(email.from)} | ${escapeHTML(formatDateTime(email.received))}</p>
      <p class="small-muted">${escapeHTML(email.snippet)}</p>
      <button data-sync-task="${email.id}" type="button">Add Task</button>
    `;
    emails.appendChild(item);
  });

  const events = document.querySelector("#syncEvents");
  events.innerHTML = "";
  syncSnapshot.calendar.forEach((event) => {
    const item = document.createElement("div");
    item.className = "sync-item";
    item.innerHTML = `
      <a href="${event.url}" target="_blank" rel="noreferrer">${escapeHTML(event.title)}</a>
      <p class="small-muted">${escapeHTML(formatDateTime(event.start))}</p>
      <p class="small-muted">${escapeHTML(event.location || "No location added.")}</p>
    `;
    events.appendChild(item);
  });

  const drive = document.querySelector("#syncDrive");
  drive.innerHTML = "";
  syncSnapshot.drive.forEach((file) => {
    const item = document.createElement("div");
    item.className = "sync-item";
    item.innerHTML = `
      <a href="${file.url}" target="_blank" rel="noreferrer">${escapeHTML(file.title)}</a>
      <p class="small-muted">${escapeHTML(file.type)} | Updated ${escapeHTML(formatDateTime(file.updated))}</p>
    `;
    drive.appendChild(item);
  });
}

function createAttendanceSession(date = document.querySelector("#attendanceDate")?.value || todayArizonaISO()) {
  const info = getMeetingInfoForArizonaDate(date);
  let session = state.attendanceSessions.find((item) => item.date === date);
  if (!session) {
    session = {
      id: crypto.randomUUID ? crypto.randomUUID() : `attendance-${Date.now()}`,
      date,
      meetingType: info.type,
      meetingTime: info.meetingTime,
      records: []
    };
    state.attendanceSessions.unshift(session);
  }

  state.agents.forEach((agent) => {
    if (!session.records.some((record) => record.agentId === agent.id)) {
      session.records.push({ agentId: agent.id, zoom: false, office: false, note: "" });
    }
  });

  session.meetingType = info.type;
  session.meetingTime = info.meetingTime;
  saveState();
  renderAttendance();
  return session;
}

function getAttendanceSyncPayload() {
  const selectedDate = document.querySelector("#attendanceDate")?.value;
  const session = state.attendanceSessions.find((item) => item.date === selectedDate) || state.attendanceSessions[0];
  if (!session) return null;

  return {
    date: session.date,
    meetingType: session.meetingType,
    meetingTime: session.meetingTime,
    records: state.agents.map((agent) => {
      const record = session.records.find((entry) => entry.agentId === agent.id);
      return {
        name: agent.name,
        zoom: Boolean(record?.zoom ?? record?.attended),
        office: Boolean(record?.office)
      };
    })
  };
}

async function syncAttendanceToSheet() {
  const payload = getAttendanceSyncPayload();
  if (!payload) {
    showToast("Start an attendance session first.");
    return;
  }

  if (!attendanceSyncUrl) {
    await copyText(JSON.stringify(payload, null, 2));
    showToast("Sync endpoint is not set yet. Attendance payload copied.");
    return;
  }

  const response = await fetch(attendanceSyncUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Attendance sync request failed.");
  const result = await response.json();
  if (!result.ok) throw new Error(result.error || "Attendance sync failed.");
  showToast(result.ok ? `Synced ${result.updatedRows} attendance rows.` : "Attendance sync failed.");
}

function queueAttendanceSync() {
  const status = document.querySelector("#attendanceSyncStatus");
  if (!attendanceSyncUrl) {
    if (status) status.textContent = "Sync status: saved locally. Add Apps Script URL to enable spreadsheet updates.";
    return;
  }

  if (status) status.textContent = "Sync status: saving to Task Tracker...";
  window.clearTimeout(attendanceSyncTimer);
  attendanceSyncTimer = window.setTimeout(() => {
    syncAttendanceToSheet()
      .then(() => {
        if (status) status.textContent = "Sync status: synced to Task Tracker.";
      })
      .catch(() => {
        if (status) status.textContent = "Sync status: sync failed.";
      });
  }, 600);
}

function renderAttendance() {
  const dateInput = document.querySelector("#attendanceDate");
  if (dateInput && !dateInput.value) dateInput.value = todayArizonaISO();
  const selectedDate = dateInput?.value || todayArizonaISO();
  const session = state.attendanceSessions.find((item) => item.date === selectedDate);
  if (session) {
    const info = getMeetingInfoForArizonaDate(selectedDate);
    session.meetingType = info.type;
    session.meetingTime = info.meetingTime;
  }
  const sessions = document.querySelector("#attendanceSessions");
  const status = document.querySelector("#attendanceSyncStatus");
  if (status) {
    status.textContent = attendanceSyncUrl
      ? "Sync status: ready to update Task Tracker."
      : "Sync status: local only until the Apps Script URL is added.";
  }

  if (!session) {
    sessions.innerHTML = `<div class="empty-state">No attendance session for ${escapeHTML(selectedDate)}. Click Load Date to start this day.</div>`;
    return;
  }

  const rows = state.agents.map((agent) => {
    const record = session.records.find((entry) => entry.agentId === agent.id) || { zoom: false, office: false };
    const zoomChecked = Boolean(record.zoom ?? record.attended);
    const officeChecked = Boolean(record.office);
    return `
      <tr>
        <td><strong>${escapeHTML(agent.name)}</strong></td>
        <td class="attendance-check-cell">
          <input type="checkbox" data-attendance-check="zoom" data-session="${session.id}" data-agent="${agent.id}" ${zoomChecked ? "checked" : ""}>
        </td>
        <td class="attendance-check-cell">
          <input type="checkbox" data-attendance-check="office" data-session="${session.id}" data-agent="${agent.id}" ${officeChecked ? "checked" : ""}>
        </td>
      </tr>
    `;
  }).join("");

  sessions.innerHTML = `
    <table class="work-table attendance-table">
      <thead>
        <tr class="date-row">
          <th>${escapeHTML(session.date)} | ${escapeHTML(session.meetingType)} | ${escapeHTML(session.meetingTime)}</th>
          <th>Zoom</th>
          <th>Office</th>
        </tr>
        <tr>
          <th>Agent</th>
          <th>Zoom</th>
          <th>Office</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderCompliance() {
  const list = document.querySelector("#complianceList");
  list.innerHTML = "";
  state.compliance.forEach((item) => {
    const label = document.createElement("label");
    label.className = "check-item";
    label.innerHTML = `<input type="checkbox" data-compliance="${item.id}" ${item.done ? "checked" : ""}> <span>${escapeHTML(item.text)}</span>`;
    list.appendChild(label);
  });
}

function formatTaskList(tasks, fallback) {
  if (!tasks.length) return fallback;
  return tasks.map((task) => `- ${task.title}`).join("\n");
}

function buildEndOfDayReport() {
  const today = todayArizonaISO();
  const completed = state.tasks.filter((task) => task.status === "Completed");
  const active = state.tasks.filter((task) => ["Pending", "In Progress", "Needs Review", "Blocked"].includes(task.status));
  const waiting = state.tasks.filter((task) => task.status.startsWith("Waiting"));
  const tomorrow = state.tasks
    .filter((task) => task.status !== "Completed")
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 3);
  const session = state.attendanceSessions[0];
  const present = session
    ? state.agents.filter((agent) => {
        const record = session.records.find((item) => item.agentId === agent.id);
        return record?.zoom ?? record?.attended;
      })
    : [];
  const office = session
    ? state.agents.filter((agent) => session.records.find((record) => record.agentId === agent.id)?.office)
    : [];

  return `End of day update | ${today} Arizona time

Completed today:
${formatTaskList(completed, "- No completed tasks marked yet.")}

Still in progress:
${formatTaskList(active, "- No active tasks marked right now.")}

Waiting for replies:
${formatTaskList(waiting, "- No waiting items marked right now.")}

Morning Zoom attendance:
${session ? `- ${present.length} agents marked in Zoom for ${session.meetingType}.` : "- No attendance session started today."}
${present.length ? present.map((agent) => `- ${agent.name}`).join("\n") : ""}

Office attendance:
${session ? `- ${office.length} agents marked in office.` : "- No attendance session started today."}
${office.length ? office.map((agent) => `- ${agent.name}`).join("\n") : ""}

Top priorities for tomorrow:
${formatTaskList(tomorrow, "- No open priorities selected yet.")}
`;
}

function renderEndOfDayReport() {
  document.querySelector("#eodReport").value = buildEndOfDayReport();
}

function renderVideoTasks() {
  const list = document.querySelector("#videoTaskList");
  if (!list) return;

  if (!state.videoTasks.length) {
    list.innerHTML = `<div class="empty-state">No Canva video tasks yet.</div>`;
    return;
  }

  const rows = state.videoTasks.map((task) => `
    <tr>
      <td><strong>${escapeHTML(task.address)}</strong></td>
      <td>${task.canvaLink ? `<a href="${escapeHTML(task.canvaLink)}" target="_blank" rel="noreferrer">Open Canva</a>` : "No Canva link"}</td>
      <td>${escapeHTML(task.fileName || "No file added")}</td>
      <td><span class="status-pill">${escapeHTML(task.status)}</span></td>
      <td>
        <div class="table-actions">
          <button data-video-action="ready" data-id="${task.id}" type="button">Ready</button>
          <button data-video-action="posted" data-id="${task.id}" type="button">Posted</button>
        </div>
      </td>
    </tr>
  `).join("");

  list.innerHTML = `
    <table class="work-table video-table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Canva</th>
          <th>MP4 File</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderPhotoPrepSlots() {
  const container = document.querySelector("#photoPrepSlots");
  if (!container) return;

  container.innerHTML = photoPrepSlots.map((slot) => `
    <article class="photo-slot" data-photo-slot="${escapeHTML(slot)}">
      <div>
        <strong>${escapeHTML(slot)}</strong>
        <span class="section-note">Upload one photo</span>
      </div>
      <input type="file" accept="image/*" data-photo-input="${escapeHTML(slot)}">
      <div class="photo-output" data-photo-output="${escapeHTML(slot)}">
        <span>No image generated yet.</span>
      </div>
      <button type="button" data-photo-generate="${escapeHTML(slot)}">Generate</button>
    </article>
  `).join("");
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function drawCoverImage(ctx, image, width, height) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawContainImage(ctx, image, width, height, maxHeight) {
  let drawWidth = width;
  let drawHeight = image.height * (drawWidth / image.width);

  if (drawHeight > maxHeight) {
    drawHeight = maxHeight;
    drawWidth = image.width * (drawHeight / image.height);
  }

  ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

async function createInstagramPhoto(file) {
  const image = await readImageFile(file);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");

  ctx.filter = "blur(30px) brightness(0.82)";
  drawCoverImage(ctx, image, canvas.width, canvas.height);
  ctx.filter = "none";
  ctx.fillStyle = "rgba(17, 24, 39, 0.10)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawContainImage(ctx, image, canvas.width, canvas.height, 850);

  return canvas.toDataURL("image/jpeg", 0.92);
}

function makePhotoFileName(slot) {
  return `${slot.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-instagram.jpg`;
}

async function generatePhotoSlot(slot) {
  const file = photoPrepFiles.get(slot);
  const output = document.querySelector(`[data-photo-output="${CSS.escape(slot)}"]`);
  if (!file || !output) {
    showToast(`Add the ${slot} photo first.`);
    return;
  }

  output.innerHTML = `<span>Generating...</span>`;
  try {
    const dataUrl = await createInstagramPhoto(file);
    output.innerHTML = `
      <img src="${dataUrl}" alt="${escapeHTML(slot)} Instagram preview">
      <a class="download-link" href="${dataUrl}" download="${escapeHTML(makePhotoFileName(slot))}">Download JPG</a>
    `;
  } catch (error) {
    output.innerHTML = `<span>Could not generate this image.</span>`;
    showToast("Photo generation failed.");
  }
}

function renderTemplates() {
  const list = document.querySelector("#templateList");
  list.innerHTML = "";
  templates.forEach((template, index) => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.innerHTML = `
      <h3>${escapeHTML(template.title)}</h3>
      <textarea readonly>${escapeHTML(template.body)}</textarea>
      <button data-template="${index}" type="button">Copy Template</button>
    `;
    list.appendChild(card);
  });
}

function renderCategories() {
  const chips = document.querySelector("#categoryChips");
  chips.innerHTML = "";
  categories.forEach((category) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = category;
    chips.appendChild(chip);
  });
}

function renderAll() {
  setDailyState();
  renderMeeting();
  renderFocus();
  renderTasks();
  renderSync();
  renderAttendance();
  renderCompliance();
  renderEndOfDayReport();
  renderVideoTasks();
  renderPhotoPrepSlots();
  renderTemplates();
  renderCategories();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (match) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[match]);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(
    () => showToast("Copied to clipboard."),
    () => showToast("Copy failed. Select the text and copy manually.")
  );
}

async function callCanvaApi(path, options = {}) {
  const response = await fetch(`http://127.0.0.1:8787${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Canva API request failed.");
  }
  return data;
}

function showCanvaApiStatus(value) {
  const status = document.querySelector("#canvaApiStatus");
  if (!status) return;
  status.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function buildCaption({ address, status, agent, details }) {
  const cleanDetails = details.replace(/[—–-]/g, ",").trim();
  return `${address}\n${status}\n\nEXP Realty and The Jakobov Group proudly presents ${cleanDetails}\n\nExclusively listed by ${agent} and @thejakobovgroup\n\n#arizona #RealEstate #TheJakobovGroup`;
}

function setBrochureStep(step) {
  const details = document.querySelector("#brochureDetailsStep");
  const review = document.querySelector("#brochureReviewStep");
  details?.classList.toggle("active", step === "details");
  review?.classList.toggle("active", step === "review");
  document.querySelector('[data-step-pill="details"]')?.classList.toggle("active", step === "details");
  document.querySelector('[data-step-pill="review"]')?.classList.toggle("active", step === "review");
}

function createBrochureListingRow(listing = {}) {
  const id = crypto.randomUUID ? crypto.randomUUID() : `listing-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const row = document.createElement("div");
  row.className = "brochure-listing-row";
  row.dataset.listingId = id;
  row.innerHTML = `
    <label>
      Agent name
      <input data-brochure-field="agentName" required placeholder="Agent name" value="${escapeHTML(listing.agentName || "")}">
    </label>
    <label>
      Address
      <input data-brochure-field="address" required placeholder="Property address" value="${escapeHTML(listing.address || "")}">
    </label>
    <label>
      MLS #
      <input data-brochure-field="mlsNumber" required placeholder="MLS number" value="${escapeHTML(listing.mlsNumber || "")}">
    </label>
    <label>
      MLS link
      <input data-brochure-field="mlsLink" required placeholder="Paste MLS link" value="${escapeHTML(listing.mlsLink || "")}">
    </label>
    <label>
      Price
      <input data-brochure-field="price" inputmode="decimal" placeholder="$0" value="${escapeHTML(listing.price || "")}">
      <span class="logo-hint" data-logo-hint>Logo: regular</span>
    </label>
    <button class="quiet remove-listing-btn" type="button" data-remove-listing aria-label="Remove listing">x</button>
  `;
  return row;
}

function renderBrochureListingRows() {
  const container = document.querySelector("#brochureListings");
  if (!container) return;
  if (!container.children.length) container.appendChild(createBrochureListingRow());
  updateBrochureLogoHints();
}

function openBrochureModal() {
  const modal = document.querySelector("#brochureModal");
  modal?.classList.add("open");
  modal?.setAttribute("aria-hidden", "false");
  setBrochureStep("details");
  renderBrochureListingRows();
  document.querySelector("[data-brochure-field=\"agentName\"]")?.focus();
}

function closeBrochureModal() {
  const modal = document.querySelector("#brochureModal");
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
}

function parsePrice(value) {
  const number = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  const number = parsePrice(value);
  if (!number) return "Not provided";
  return number.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function getLogoType(price) {
  return parsePrice(price) >= 1000000 ? "EXP Luxury logo" : "EXP regular logo";
}

function getBrochureListings() {
  return Array.from(document.querySelectorAll(".brochure-listing-row")).map((row) => {
    const field = (name) => row.querySelector(`[data-brochure-field="${name}"]`)?.value.trim() || "";
    return {
      agentName: field("agentName"),
      address: field("address"),
      mlsNumber: field("mlsNumber"),
      mlsLink: field("mlsLink"),
      price: field("price"),
      logoType: getLogoType(field("price"))
    };
  });
}

function updateBrochureLogoHints() {
  document.querySelectorAll(".brochure-listing-row").forEach((row) => {
    const price = row.querySelector('[data-brochure-field="price"]')?.value || "";
    const hint = row.querySelector("[data-logo-hint]");
    if (hint) hint.textContent = `Logo: ${getLogoType(price).replace("EXP ", "")}`;
  });
}

function getBrochureDraftUrl(values) {
  const composeUrl = new URL("https://mail.google.com/mail/");
  composeUrl.hash = `view=cm&fs=1&to=${encodeURIComponent(values.kimEmail)}&cc=${encodeURIComponent(brochureEmailCc)}&su=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(values.body)}`;
  return composeUrl.toString();
}

async function sendBrochureRequest(values) {
  if (!brochureEmailSendUrl) {
    window.open(getBrochureDraftUrl(values), "_blank", "noreferrer");
    addBrochureWaitingTask(values);
    return { sent: false, fallback: true };
  }

  const response = await fetch(brochureEmailSendUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      to: values.kimEmail,
      cc: brochureEmailCc,
      subject: values.subject,
      body: values.body,
      listings: values.listings
    })
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "Email send failed.");
  addBrochureWaitingTask(values);
  return { sent: true, result };
}

function getBrochureRequestValues() {
  const listings = getBrochureListings();
  return {
    kimEmail: document.querySelector("#brochureKimEmail")?.value.trim() || "KLeal@navititle.com",
    listings
  };
}

function getBrochureSubject(values) {
  if (values.listings.length === 1) {
    const listing = values.listings[0];
    return `Luxury Brochure Request - ${listing.address} & MLS# ${listing.mlsNumber}`;
  }
  return `Luxury Brochure Request - ${values.listings.length} Listings`;
}

function getBrochureListingText(listings) {
  return listings.map((listing, index) => `${index + 1}. Agent Name: ${listing.agentName}
   Address: ${listing.address}
   MLS #: ${listing.mlsNumber}
   MLS Link: ${listing.mlsLink}
   Price: ${formatMoney(listing.price)}
   Required logo: ${listing.logoType}`).join("\n\n");
}

function buildBrochureRequest() {
  const values = getBrochureRequestValues();
  const subject = getBrochureSubject(values);
  const listingWord = values.listings.length > 1 ? "listings" : "listing";
  const body = `Hi Kim,

I hope you're doing well.

We would like to request custom luxury listing brochure support for the following ${listingWord}. We're looking for a polished, high-end design that aligns with our branding and highlights each property in a premium way.

Please see the details below:

${getBrochureListingText(values.listings)}

Logo rule: listings priced at $1,000,000 or more should use the EXP Luxury logo. Listings below $1,000,000 should use the regular EXP logo.

Kindly let us know if you need any additional materials such as photos, property descriptions, floor plans, or specific branding elements. We're happy to provide everything needed to move this forward.

Thank you so much, and we're looking forward to seeing the initial draft.

${brochureEmailSignature}`;

  document.querySelector("#brochureSubjectOutput").value = subject;
  document.querySelector("#brochureBodyOutput").value = body;
  return { ...values, subject, body };
}

function validateBrochureRequest(values) {
  const missing = [];
  if (!values.listings.length) missing.push("at least one listing");
  values.listings.forEach((listing, index) => {
    const label = `listing ${index + 1}`;
    if (!listing.agentName) missing.push(`${label} agent name`);
    if (!listing.address) missing.push(`${label} address`);
    if (!listing.mlsNumber) missing.push(`${label} MLS number`);
    if (!listing.mlsLink) missing.push(`${label} MLS link`);
  });
  if (missing.length) {
    showToast(`Add ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "..." : ""} first.`);
    return false;
  }
  return true;
}

function addBrochureWaitingTask(values) {
  const label = values.listings.length === 1 ? values.listings[0].address : `${values.listings.length} listings`;
  const title = `Watch for Kim brochure reply for ${label}`;
  const exists = state.tasks.some((task) => task.title === title);
  if (exists) return;
  state.tasks.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `task-brochure-${Date.now()}`,
    title,
    category: "Email Tasks",
    status: "Waiting for Designer",
    priority: "High",
    due: todayISO(),
    notes: `Luxury brochure requested. Listings: ${values.listings.map((listing) => `${listing.agentName}: ${listing.address} (${listing.mlsNumber}, ${listing.logoType})`).join("; ")}`
  });
  saveState();
  renderFocus();
  renderTasks();
}
function initControls() {
  fillSelect(document.querySelector("#taskCategory"), categories);
  fillSelect(document.querySelector("#taskStatus"), statuses);
  fillSelect(document.querySelector("#taskPriority"), priorities);
  fillSelect(document.querySelector("#categoryFilter"), categories);
  fillSelect(document.querySelector("#statusFilter"), statuses);
}

document.addEventListener("DOMContentLoaded", () => {
  initControls();
  const openVideoTemplateLink = document.querySelector("#openVideoTemplateLink");
  if (openVideoTemplateLink) {
    openVideoTemplateLink.href = canvaVideoTemplate.editUrl;
    openVideoTemplateLink.title = `${canvaVideoTemplate.name} Canva template`;
  }
  renderAll();

  document.querySelector("#copyMeetingBtn").addEventListener("click", () => {
    copyText(getMeetingInfo().message);
  });

  document.querySelector("#copyWhatsappBtn").addEventListener("click", () => {
    copyText(getMeetingInfo().message);
  });

  const markMeetingSentButton = document.querySelector("#markMeetingSent");
  if (markMeetingSentButton) {
    markMeetingSentButton.addEventListener("click", () => {
      state.dailyState = { ...state.dailyState, date: todayArizonaISO(), meetingSent: true };
      saveState();
      renderMeeting();
      showToast("Meeting reminder marked sent for today.");
    });
  }

  document.querySelector("#markWhatsappSent").addEventListener("click", () => {
    state.dailyState = { ...state.dailyState, date: todayArizonaISO(), whatsappSent: true };
    saveState();
    renderMeeting();
    showToast("WhatsApp reminder marked sent for today.");
  });

  document.querySelector("#resetDailyBtn").addEventListener("click", () => {
    state.dailyState = { date: todayArizonaISO(), meetingSent: false, whatsappSent: false };
    saveState();
    renderAll();
    showToast("Daily state reset.");
  });

  window.setInterval(renderWhatsappReminder, 30000);

  document.querySelector("#taskForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.tasks.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`,
      title: document.querySelector("#taskTitle").value.trim(),
      category: document.querySelector("#taskCategory").value,
      status: document.querySelector("#taskStatus").value,
      priority: document.querySelector("#taskPriority").value,
      due: document.querySelector("#taskDue").value,
      notes: document.querySelector("#taskNotes").value.trim()
    });
    event.target.reset();
    saveState();
    renderAll();
    showToast("Task added.");
  });

  document.querySelector("#taskList").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const task = state.tasks.find((item) => item.id === button.dataset.id);
    if (!task) return;
    if (button.dataset.action === "progress") task.status = "In Progress";
    if (button.dataset.action === "review") task.status = "Needs Review";
    if (button.dataset.action === "complete") task.status = "Completed";
    if (button.dataset.action === "delete") state.tasks = state.tasks.filter((item) => item.id !== task.id);
    saveState();
    renderAll();
  });

  document.querySelector("#syncEmails").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sync-task]");
    if (!button) return;
    const email = syncSnapshot.gmail.items.find((item) => item.id === button.dataset.syncTask);
    if (!email) return;
    state.tasks.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`,
      title: email.suggestedTask,
      category: email.from.includes("Flexmls") ? "Listing Marketing" : "Social Media Management",
      status: "Pending",
      priority: email.from.includes("Flexmls") ? "High" : "Medium",
      due: todayISO(),
      notes: `From Gmail: ${email.subject}. ${email.snippet}`
    });
    saveState();
    renderAll();
    showToast("Gmail item added as a task.");
  });

  document.querySelector("#importSyncTasksBtn").addEventListener("click", () => {
    const existingNotes = new Set(state.tasks.map((task) => task.notes));
    const newTasks = syncSnapshot.gmail.items
      .filter((email) => !existingNotes.has(`From Gmail: ${email.subject}. ${email.snippet}`))
      .map((email) => ({
        id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${email.id}`,
        title: email.suggestedTask,
        category: email.from.includes("Flexmls") ? "Listing Marketing" : "Social Media Management",
        status: "Pending",
        priority: email.from.includes("Flexmls") ? "High" : "Medium",
        due: todayISO(),
        notes: `From Gmail: ${email.subject}. ${email.snippet}`
      }));
    state.tasks = [...newTasks, ...state.tasks];
    saveState();
    renderAll();
    showToast(`${newTasks.length} suggested tasks added.`);
  });

  document.querySelector("#agentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.agents.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `agent-${Date.now()}`,
      name: document.querySelector("#agentName").value.trim(),
      note: document.querySelector("#agentNote").value.trim()
    });
    event.target.reset();
    saveState();
    renderAttendance();
    showToast("Agent added to roster.");
  });

  document.querySelector("#addAttendanceSessionBtn").addEventListener("click", () => {
    createAttendanceSession();
    showToast("Attendance date loaded.");
  });

  document.querySelector("#attendanceDate").addEventListener("change", () => {
    renderAttendance();
  });

  document.querySelector("#syncAttendanceBtn").addEventListener("click", () => {
    syncAttendanceToSheet().catch(() => showToast("Attendance sync failed."));
  });

  document.querySelector("#attendanceSessions").addEventListener("click", (event) => {
    const checkbox = event.target.closest("input[data-attendance-check]");
    if (!checkbox) return;
    const session = state.attendanceSessions.find((item) => item.id === checkbox.dataset.session);
    if (!session) return;
    let record = session.records.find((item) => item.agentId === checkbox.dataset.agent);
    if (!record) {
      record = { agentId: checkbox.dataset.agent, zoom: false, office: false, note: "" };
      session.records.push(record);
    }
    if (checkbox.dataset.attendanceCheck === "office") {
      record.office = checkbox.checked;
    } else {
      record.zoom = checkbox.checked;
      record.attended = checkbox.checked;
    }
    saveState();
    renderAttendance();
    queueAttendanceSync();
  });

  document.querySelector("#categoryFilter").addEventListener("change", renderTasks);
  document.querySelector("#statusFilter").addEventListener("change", renderTasks);

  document.querySelector("#complianceList").addEventListener("change", (event) => {
    const checkbox = event.target.closest("input[type='checkbox']");
    if (!checkbox) return;
    const item = state.compliance.find((entry) => entry.id === checkbox.dataset.compliance);
    if (item) item.done = checkbox.checked;
    saveState();
  });

  document.querySelector("#resetComplianceBtn").addEventListener("click", () => {
    state.compliance = state.compliance.map((item) => ({ ...item, done: false }));
    saveState();
    renderCompliance();
    showToast("Compliance checklist reset.");
  });

  document.querySelector("#refreshEodBtn").addEventListener("click", () => {
    renderEndOfDayReport();
    showToast("End of day report regenerated.");
  });

  document.querySelector("#copyEodBtn").addEventListener("click", () => {
    renderEndOfDayReport();
    copyText(document.querySelector("#eodReport").value);
  });

  document.querySelector("#checkCanvaApiBtn").addEventListener("click", async () => {
    showCanvaApiStatus("Checking Canva API...");
    try {
      const status = await callCanvaApi("/api/canva/status");
      const login = await callCanvaApi("/api/canva/login-url");
      showCanvaApiStatus({ ...status, loginUrl: login.url });
    } catch (error) {
      showCanvaApiStatus(`Could not reach Canva API server.\n\n${error.message}`);
    }
  });

  document.querySelector("#exportCanvaVideoBtn").addEventListener("click", async () => {
    showCanvaApiStatus("Starting Canva MP4 export. This can take a minute...");
    try {
      const result = await callCanvaApi("/api/canva/export", {
        method: "POST",
        body: JSON.stringify({
          designId: canvaVideoTemplate.designId,
          title: "social-media-video"
        })
      });
      showCanvaApiStatus(result);
      showToast("Canva MP4 export finished.");
    } catch (error) {
      showCanvaApiStatus(`Canva export failed.\n\n${error.message}`);
    }
  });

  document.querySelector("#templateList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-template]");
    if (!button) return;
    copyText(templates[Number(button.dataset.template)].body);
  });

  document.querySelector("#openBrochureModalBtn").addEventListener("click", (event) => {
    event.preventDefault();
    openBrochureModal();
  });

  document.querySelector("#closeBrochureModalBtn").addEventListener("click", closeBrochureModal);

  document.querySelector("#brochureModal").addEventListener("click", (event) => {
    if (event.target.id === "brochureModal") closeBrochureModal();
  });

  document.querySelector("#addBrochureListingBtn").addEventListener("click", () => {
    document.querySelector("#brochureListings").appendChild(createBrochureListingRow());
    updateBrochureLogoHints();
  });

  document.querySelector("#brochureListings").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-remove-listing]");
    if (!button) return;
    const rows = document.querySelectorAll(".brochure-listing-row");
    if (rows.length <= 1) {
      showToast("Keep at least one listing in the request.");
      return;
    }
    button.closest(".brochure-listing-row")?.remove();
  });

  document.querySelector("#brochureListings").addEventListener("input", (event) => {
    if (event.target.matches('[data-brochure-field="price"]')) updateBrochureLogoHints();
  });

  document.querySelector("#reviewBrochureRequestBtn").addEventListener("click", () => {
    const values = buildBrochureRequest();
    if (!validateBrochureRequest(values)) return;
    document.querySelector("#brochureSendStatus").textContent = "Review everything before sending. Use Edit Details if anything needs fixing.";
    setBrochureStep("review");
  });

  document.querySelector("#editBrochureRequestBtn").addEventListener("click", () => {
    setBrochureStep("details");
  });

  document.querySelector("#copyBrochureRequestBtn").addEventListener("click", () => {
    const values = buildBrochureRequest();
    if (!validateBrochureRequest(values)) return;
    copyText(`Subject: ${values.subject}\n\n${values.body}`);
  });

  document.querySelector("#confirmSendBrochureBtn").addEventListener("click", async () => {
    const values = buildBrochureRequest();
    if (!validateBrochureRequest(values)) return;
    const status = document.querySelector("#brochureSendStatus");
    status.textContent = "Sending request...";
    try {
      const result = await sendBrochureRequest(values);
      if (result.fallback) {
        status.textContent = "Gmail draft opened. Review it, then click Send in Gmail. A waiting task was added.";
        showToast("Gmail draft opened and waiting task added.");
      } else {
        status.textContent = "Request sent to Kim and waiting task added.";
        showToast("Luxury brochure request sent to Kim.");
        closeBrochureModal();
      }
      renderFocus();
      renderTasks();
    } catch (error) {
      status.textContent = `Could not send automatically. ${error.message}`;
      showToast("Brochure request send failed.");
    }
  });

  document.querySelector("#captionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const caption = buildCaption({
      address: document.querySelector("#captionAddress").value.trim(),
      status: document.querySelector("#captionStatus").value,
      agent: document.querySelector("#captionAgent").value.trim(),
      details: document.querySelector("#captionDetails").value.trim()
    });
    document.querySelector("#captionOutput").value = caption;
  });

  document.querySelector("#useVideoTemplateBtn").addEventListener("click", () => {
    document.querySelector("#videoCanvaLink").value = canvaVideoTemplate.editUrl;
    showToast(`${canvaVideoTemplate.name} template added.`);
  });

  document.querySelector("#addVideoTaskBtn").addEventListener("click", () => {
    const address = document.querySelector("#videoAddress").value.trim();
    if (!address) {
      showToast("Add a property address first.");
      return;
    }
    state.videoTasks.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : `video-${Date.now()}`,
      address,
      canvaLink: document.querySelector("#videoCanvaLink").value.trim(),
      fileName: document.querySelector("#videoFileName").value.trim(),
      status: document.querySelector("#videoStatus").value
    });
    document.querySelector("#videoTaskForm").reset();
    saveState();
    renderVideoTasks();
    showToast("Canva video task added.");
  });

  document.querySelector("#videoTaskList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-video-action]");
    if (!button) return;
    const task = state.videoTasks.find((item) => item.id === button.dataset.id);
    if (!task) return;
    if (button.dataset.videoAction === "ready") task.status = "Ready To Post";
    if (button.dataset.videoAction === "posted") task.status = "Posted";
    saveState();
    renderVideoTasks();
  });

  document.querySelector("#photoPrepSlots").addEventListener("change", (event) => {
    const input = event.target.closest("input[data-photo-input]");
    if (!input || !input.files.length) return;
    photoPrepFiles.set(input.dataset.photoInput, input.files[0]);
    const output = document.querySelector(`[data-photo-output="${CSS.escape(input.dataset.photoInput)}"]`);
    if (output) output.innerHTML = `<span>${escapeHTML(input.files[0].name)} selected.</span>`;
  });

  document.querySelector("#photoPrepSlots").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-photo-generate]");
    if (!button) return;
    generatePhotoSlot(button.dataset.photoGenerate);
  });

  document.querySelector("#generatePhotoPrepBtn").addEventListener("click", () => {
    photoPrepSlots.forEach((slot) => generatePhotoSlot(slot));
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.tab}`).classList.add("active");
    });
  });
});
