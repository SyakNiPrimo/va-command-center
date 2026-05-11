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
const socialPostsSyncUrl = "";
const gmailListingSyncUrl = "";
const brochureEmailSendUrl = "https://script.google.com/macros/s/AKfycbzQvm4KYNm9qkTeXXUzTYbuQlL-6aU5FdIGO172ovZZ-HVZfqxALkoY_vhDiguV4qHdAQ/exec";
const brochureEmailCc = "ralph@jakobovgroup.com";
const brochureEmailSignature = "Best,\nBen Tiaga";
const authConfig = {
  username: "ben",
  password: "change-this-password"
};
const authLocalStorageKey = "vaCommandCenterAuth";
const authSessionStorageKey = "vaCommandCenterSessionAuth";
const brandConfig = {
  mainBrandName: "The Jakobov Group",
  appName: "VA Command Center",
  sidebarLogo: "assets/branding/jakobov-white.svg",
  lightBackgroundLogo: "assets/branding/jakobov-dark.svg",
  luxuryLogo: "assets/branding/exp-luxury.svg",
  regularListingLogo: "assets/branding/exp-realty.svg",
  fallbackLogo: "assets/branding/blank.svg",
  primaryBrandColor: "#111111",
  accentBrandColor: "#c8ad5f",
  brandingMode: "Jakobov Internal"
};
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
const socialPostFilters = [
  "All",
  "Coming Soon",
  "New Listing",
  "Active",
  "Pending",
  "Under Contract",
  "Closed",
  "New",
  "Needs Design",
  "Design Done",
  "Needs Photos",
  "Photos Selected",
  "Photo Prep Ready",
  "Needs Caption",
  "Caption Ready",
  "Ready To Send To WhatsApp",
  "Posted",
  "Completed",
  "Canceled",
  "Duplicate"
];
const socialWorkflowStatuses = [
  "New",
  "Needs Design",
  "Design Done",
  "Needs Photos",
  "Photos Selected",
  "Photo Prep Ready",
  "Needs Caption",
  "Caption Ready",
  "Ready To Send To WhatsApp",
  "Posted",
  "Completed",
  "Canceled",
  "Duplicate or Cancelled"
];
const socialPhotoSlots = [
  "Living Room",
  "Kitchen",
  "Dining",
  "Bedroom",
  "Bathroom",
  "Exterior Yard or Best Feature"
];
const instagramPhotoOutput = {
  width: 1080,
  height: 1350,
  foregroundMaxWidth: 1000,
  foregroundMaxHeight: 1020,
  jpegQuality: 0.92
};
const captionServerUrl = "http://127.0.0.1:8791/generate-caption";
const agentHeadshotsFolderUrl = "https://drive.google.com/drive/folders/1upm9VVosOnJTwSaa36HWhnfeVxWy5XBB?usp=sharing";
const agentHeadshotFiles = [
  "Alijah.jpeg",
  "Angela.jpeg",
  "Kelly.jpeg",
  "Kath.jpeg",
  "Kath2.jpeg",
  "Mauricio.jpeg",
  "Katelyn.jpeg",
  "Sam.jpeg",
  "Stephen.jpeg",
  "Chris.jpeg",
  "Tyler.jpeg",
  "James.jpeg",
  "James2.jpeg",
  "Marissa.jpeg",
  "Catherine.jpeg",
  "Catherine2.jpeg",
  "Steph.jpeg",
  "Joe.jpeg",
  "Teddy.jpeg",
  "Shayna.jpeg",
  "Steele.jpeg",
  "Ari1.jpeg",
  "Ari2.jpeg",
  "Ari3.jpeg",
  "Svetlana.jpeg"
];
const agentHeadshotAliases = {
  steele: ["Steele.jpeg"],
  ari: ["Ari1.jpeg", "Ari2.jpeg", "Ari3.jpeg"],
  arizona: ["Ari1.jpeg", "Ari2.jpeg", "Ari3.jpeg"],
  jakobov: ["Ari1.jpeg", "Ari2.jpeg", "Ari3.jpeg"],
  stephanie: ["Steph.jpeg"],
  steph: ["Steph.jpeg"],
  katherine: ["Kath.jpeg", "Kath2.jpeg"],
  kath: ["Kath.jpeg", "Kath2.jpeg"],
  kathryn: ["Kath.jpeg", "Kath2.jpeg"],
  catherine: ["Catherine.jpeg", "Catherine2.jpeg"],
  james: ["James.jpeg", "James2.jpeg"],
  samuel: ["Sam.jpeg"],
  sam: ["Sam.jpeg"],
  josef: ["Joe.jpeg"],
  joseph: ["Joe.jpeg"],
  joe: ["Joe.jpeg"]
};
const defaultPaymentSummary = "Work includes administrative support, coordination, updates, listing and social media support, automation/app updates, and other assigned VA tasks throughout the week.";
const triviaChecklistItems = [
  "Choose topic",
  "Review Slide 1",
  "Review Slide 2",
  "Choose images",
  "Create carousel design",
  "Review caption",
  "Post",
  "Mark completed"
];
const triviaTopicBank = [
  {
    category: "Nature",
    topic: "Arizona landscape variety",
    slide1: "DID YOU KNOW?\nArizona is not just desert. It also has mountain towns, pine forests, and snowy winters.",
    slide2: "WHY PEOPLE LOVE IT\nArizona gives you options. You can enjoy sunny desert living, then escape to cooler mountain weather just a few hours away.",
    caption: "Arizona living comes with more variety than many people expect.\n\nFrom desert views to pine forests and cooler mountain towns, the state offers different lifestyles within just a few hours of each other. That variety is one reason so many people love calling Arizona home."
  },
  {
    category: "Lifestyle",
    topic: "Arizona outdoor living",
    slide1: "DID YOU KNOW?\nArizona has more than 300 sunny days in many parts of the state.",
    slide2: "WHY PEOPLE LOVE IT\nThat sunshine makes patios, pools, hiking, golf, and outdoor dining part of everyday life for many Arizona residents.",
    caption: "Arizona makes outdoor living feel easy.\n\nWith so much sunshine throughout the year, residents can enjoy patios, hikes, golf, pool days, and beautiful desert evenings as part of their regular routine."
  },
  {
    category: "Real Estate",
    topic: "Arizona lifestyle choice",
    slide1: "DID YOU KNOW?\nArizona offers everything from lock and leave condos to luxury desert estates.",
    slide2: "WHY PEOPLE LOVE IT\nBuyers can choose a lifestyle that fits them, from low maintenance living to space, views, privacy, and resort style amenities.",
    caption: "Arizona real estate gives buyers room to choose the lifestyle they want.\n\nFrom easy lock and leave homes to luxury properties with mountain views and outdoor living spaces, there is something here for many different seasons of life."
  },
  {
    category: "Local Fun Facts",
    topic: "Arizona sunsets",
    slide1: "DID YOU KNOW?\nArizona sunsets are famous because desert dust and dry air help create vivid colors.",
    slide2: "WHY PEOPLE LOVE IT\nThose glowing skies turn everyday evenings into something special, especially from homes with mountain or open desert views.",
    caption: "Arizona sunsets are one of the small daily luxuries of living here.\n\nThe desert sky often brings bold color, soft light, and mountain silhouettes that make evenings feel memorable right from home."
  },
  {
    category: "Seasonal",
    topic: "Arizona winter lifestyle",
    slide1: "DID YOU KNOW?\nArizona winters are one of the biggest reasons people relocate or spend part of the year here.",
    slide2: "WHY PEOPLE LOVE IT\nMild winter weather means more time outside, easier travel around town, and a lifestyle that feels active year round.",
    caption: "Arizona winters are a major lifestyle draw.\n\nWhile many places slow down in colder months, Arizona offers mild weather, outdoor activities, and a comfortable rhythm that keeps life moving."
  }
];
let activeSocialPostFilter = "All";
let socialPostSearchTerm = "";

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

function addDaysISO(dateString, days) {
  const date = new Date(`${dateString}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getArizonaWeekday(date = new Date()) {
  return getArizonaParts(date).weekday;
}

function getArizonaWeekStartISO(date = new Date()) {
  const today = todayArizonaISO(date);
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const index = weekdays.indexOf(getArizonaWeekday(date));
  const mondayOffset = index === 0 ? -6 : 1 - index;
  return addDaysISO(today, mondayOffset);
}

function getArizonaWeekKey(date = new Date()) {
  return getArizonaWeekStartISO(date);
}

function getCurrentPaymentKey(date = new Date()) {
  const weekStart = getArizonaWeekStartISO(date);
  return addDaysISO(weekStart, 4);
}

function isFridayArizona(date = new Date()) {
  return getArizonaWeekday(date) === "Friday";
}

function isWednesdayArizona(date = new Date()) {
  return getArizonaWeekday(date) === "Wednesday";
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
    socialPosts: [],
    agentProfiles: {},
    videoTasks: seedVideoTasks,
    paymentRequests: {},
    weeklyTriviaPosts: {},
    triviaHistory: []
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

function getStoredAuthSession() {
  const sessionValue = sessionStorage.getItem(authSessionStorageKey);
  const localValue = localStorage.getItem(authLocalStorageKey);
  const raw = sessionValue || localValue;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.authenticated) return null;
    return {
      ...parsed,
      sessionType: sessionValue ? "Session storage" : "Local storage"
    };
  } catch {
    sessionStorage.removeItem(authSessionStorageKey);
    localStorage.removeItem(authLocalStorageKey);
    return null;
  }
}

function setAuthSession(username, remember) {
  const session = {
    authenticated: true,
    username,
    loginAt: new Date().toISOString()
  };
  sessionStorage.removeItem(authSessionStorageKey);
  localStorage.removeItem(authLocalStorageKey);
  const key = remember ? authLocalStorageKey : authSessionStorageKey;
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(key, JSON.stringify(session));
}

function clearAuthSession() {
  sessionStorage.removeItem(authSessionStorageKey);
  localStorage.removeItem(authLocalStorageKey);
}

function applyAuthState() {
  const session = getStoredAuthSession();
  const isAuthenticated = Boolean(session);
  document.body.classList.toggle("is-authenticated", isAuthenticated);
  document.body.classList.toggle("is-locked", !isAuthenticated);
  const loginScreen = document.querySelector("#loginScreen");
  const appFrame = document.querySelector("#appFrame");
  if (loginScreen) loginScreen.hidden = isAuthenticated;
  if (appFrame) appFrame.hidden = !isAuthenticated;
  renderSecuritySettings();
  renderFooterStatus();
  return isAuthenticated;
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.querySelector("#loginUsername")?.value.trim() || "";
  const password = document.querySelector("#loginPassword")?.value || "";
  const remember = Boolean(document.querySelector("#rememberLogin")?.checked);
  const error = document.querySelector("#loginError");
  if (username === authConfig.username && password === authConfig.password) {
    setAuthSession(username, remember);
    if (error) error.textContent = "";
    document.querySelector("#loginForm")?.reset();
    applyAuthState();
    renderAll();
    showToast("Welcome back.");
    return;
  }
  if (error) error.textContent = "Login failed. Check the username and password.";
}

function handleLogout() {
  clearAuthSession();
  applyAuthState();
  showToast("Logged out.");
  window.setTimeout(() => document.querySelector("#loginUsername")?.focus(), 50);
}

function setDailyState() {
  if (!Array.isArray(state.socialPosts)) state.socialPosts = [];
  if (!state.agentProfiles) state.agentProfiles = {};
  if (!state.paymentRequests) state.paymentRequests = {};
  if (!state.weeklyTriviaPosts) state.weeklyTriviaPosts = {};
  if (!Array.isArray(state.triviaHistory)) state.triviaHistory = [];
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
  ensureWeeklyPaymentRequest();
  ensureWeeklyTriviaPost();
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
  const meetingType = document.querySelector("#meetingType");
  if (meetingType) meetingType.textContent = state.dailyState.meetingSent ? `${info.type} sent` : info.type;
  document.querySelector("#meetingTitle").textContent = info.title;
  document.querySelector("#meetingTime").textContent = info.meetingTime;
  document.querySelector("#meetingDescription").textContent = info.description;
  document.querySelector("#meetingMessage").value = info.message;
  renderWhatsappReminder();
  renderHeaderStatus();
}

function renderHeaderStatus() {
  const chips = document.querySelector("#headerStatusChips");
  if (!chips) return;
  const info = getMeetingInfo();
  const chipItems = [
    state.dailyState.meetingSent ? `${info.type} sent` : info.type
  ];
  if (isFridayArizona()) {
    const payment = getCurrentPaymentRequest();
    chipItems.push(payment.sent ? "Payment Sent" : "Payment Due");
  }
  if (isWednesdayArizona()) {
    const trivia = getCurrentTriviaPost();
    if (!["Posted", "Completed"].includes(trivia?.status)) chipItems.push("Trivia Due");
  }
  chips.innerHTML = chipItems.map((item) => `<span class="status-pill">${escapeHTML(item)}</span>`).join("");
}

function updateHeaderPageTitle(title = "Dashboard") {
  const header = document.querySelector("#headerPageTitle");
  if (header) header.textContent = title;
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

function getCurrentPaymentRequest() {
  const key = getCurrentPaymentKey();
  if (!state.paymentRequests[key]) {
    const weekStart = getArizonaWeekStartISO();
    state.paymentRequests[key] = {
      key,
      startDate: weekStart,
      endDate: key,
      totalHours: 40,
      ratePerHour: 5,
      totalAmount: 200,
      workSummary: defaultPaymentSummary,
      message: "",
      sent: false
    };
  }
  return state.paymentRequests[key];
}

function calculatePaymentTotal(hours, rate) {
  const total = Number(hours || 0) * Number(rate || 0);
  return Number.isFinite(total) ? total : 0;
}

function buildPaymentRequestMessage(payment) {
  const total = calculatePaymentTotal(payment.totalHours, payment.ratePerHour);
  const summary = payment.workSummary || defaultPaymentSummary;
  return `Hi Ari,

This payment request covers work completed from ${payment.startDate} to ${payment.endDate} for general VA support tasks.

Total hours: ${payment.totalHours} hours
Rate: $${payment.ratePerHour}/hour
Total amount due: $${total}

${summary}

Thank you!
Ben`;
}

function collectPaymentRequestFromForm() {
  const payment = getCurrentPaymentRequest();
  payment.startDate = document.querySelector("#paymentStartDate")?.value || payment.startDate;
  payment.endDate = document.querySelector("#paymentEndDate")?.value || payment.endDate;
  payment.totalHours = Number(document.querySelector("#paymentHours")?.value || 0);
  payment.ratePerHour = Number(document.querySelector("#paymentRate")?.value || 0);
  payment.totalAmount = calculatePaymentTotal(payment.totalHours, payment.ratePerHour);
  payment.workSummary = document.querySelector("#paymentSummary")?.value.trim() || defaultPaymentSummary;
  payment.message = buildPaymentRequestMessage(payment);
  return payment;
}

function renderPaymentRequest() {
  const payment = getCurrentPaymentRequest();
  const dueToday = isFridayArizona();
  const card = document.querySelector("#paymentRequestCard");
  if (!card) return;
  card.classList.toggle("ready", dueToday && !payment.sent);
  document.querySelector("#paymentRequestStatus").textContent = payment.sent ? "Sent This Friday" : dueToday ? "Due Today" : "Due Friday";
  document.querySelector("#paymentReminderText").textContent = dueToday
    ? "Payment request is due today. Review hours, copy message, then send to Ari."
    : "Payment request appears every Friday morning Arizona time.";
  document.querySelector("#paymentStartDate").value = payment.startDate;
  document.querySelector("#paymentEndDate").value = payment.endDate;
  document.querySelector("#paymentHours").value = payment.totalHours;
  document.querySelector("#paymentRate").value = payment.ratePerHour;
  document.querySelector("#paymentTotal").value = `$${calculatePaymentTotal(payment.totalHours, payment.ratePerHour)}`;
  document.querySelector("#paymentSummary").value = payment.workSummary || defaultPaymentSummary;
  document.querySelector("#paymentMessageOutput").value = payment.message || buildPaymentRequestMessage(payment);
  document.querySelector("#markPaymentSentBtn").classList.toggle("done", payment.sent);
  document.querySelector("#markPaymentSentBtn").textContent = payment.sent ? "Sent" : "Mark Sent";
}

function updatePaymentTotalPreview() {
  const total = calculatePaymentTotal(document.querySelector("#paymentHours")?.value, document.querySelector("#paymentRate")?.value);
  const field = document.querySelector("#paymentTotal");
  if (field) field.value = `$${total}`;
}

function pickTriviaTopic() {
  const lastTopic = state.triviaHistory?.[0];
  return triviaTopicBank.find((item) => item.topic !== lastTopic) || triviaTopicBank[0];
}

function buildTriviaFromTopic(topicItem = pickTriviaTopic()) {
  const hashtags = "#arizona #RealEstate #TheJakobovGroup";
  return {
    weekKey: getArizonaWeekKey(),
    topic: `${topicItem.category}: ${topicItem.topic}`,
    slide1Text: topicItem.slide1,
    slide2Text: topicItem.slide2,
    caption: `${topicItem.caption}\n\n${hashtags}`,
    hashtags,
    backgroundImage1: "",
    backgroundImage2: "",
    status: "Drafting",
    dateCreated: todayArizonaISO(),
    datePosted: "",
    checklist: Object.fromEntries(triviaChecklistItems.map((item) => [item, false]))
  };
}

function ensureWeeklyPaymentRequest() {
  getCurrentPaymentRequest();
}

function ensureWeeklyTriviaPost() {
  const key = getArizonaWeekKey();
  if (!state.weeklyTriviaPosts[key] && isWednesdayArizona()) {
    const post = buildTriviaFromTopic();
    state.weeklyTriviaPosts[key] = post;
    state.triviaHistory = [post.topic, ...(state.triviaHistory || []).filter((topic) => topic !== post.topic)].slice(0, 8);
  }
}

function getCurrentTriviaPost() {
  const key = getArizonaWeekKey();
  if (!state.weeklyTriviaPosts[key]) state.weeklyTriviaPosts[key] = buildTriviaFromTopic();
  return state.weeklyTriviaPosts[key];
}

function collectTriviaPostFromForm() {
  const post = getCurrentTriviaPost();
  post.topic = document.querySelector("#triviaTopic")?.value.trim() || post.topic;
  post.slide1Text = document.querySelector("#triviaSlide1")?.value.trim() || "";
  post.slide2Text = document.querySelector("#triviaSlide2")?.value.trim() || "";
  post.caption = document.querySelector("#triviaCaption")?.value.trim() || "";
  post.hashtags = document.querySelector("#triviaHashtags")?.value.trim() || "#arizona #RealEstate #TheJakobovGroup";
  post.backgroundImage1 = document.querySelector("#triviaBackground1")?.value.trim() || "";
  post.backgroundImage2 = document.querySelector("#triviaBackground2")?.value.trim() || "";
  post.status = document.querySelector("#triviaStatus")?.value || post.status;
  post.dateCreated = document.querySelector("#triviaDateCreated")?.value || post.dateCreated || todayArizonaISO();
  post.datePosted = document.querySelector("#triviaDatePosted")?.value || post.datePosted || "";
  return post;
}

function cleanTriviaCopy(text) {
  return String(text || "").replace(/[\u2014\u2013-]/g, ",").trim();
}

async function improveTriviaWithServer(post) {
  const response = await fetch("http://127.0.0.1:8791/generate-trivia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post)
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "Trivia generation failed.");
  return result.post;
}

async function generateWeeklyTriviaPost() {
  const localPost = buildTriviaFromTopic();
  let finalPost = localPost;
  const status = document.querySelector("#triviaGeneratorStatus");
  try {
    finalPost = await improveTriviaWithServer(localPost);
    if (status) status.textContent = "Generated with caption server.";
  } catch (error) {
    if (status) status.textContent = "Using local trivia generator. Start caption server for stronger copy.";
  }
  finalPost.caption = cleanTriviaCopy(finalPost.caption || localPost.caption);
  finalPost.slide1Text = cleanTriviaCopy(finalPost.slide1Text || localPost.slide1Text);
  finalPost.slide2Text = cleanTriviaCopy(finalPost.slide2Text || localPost.slide2Text);
  finalPost.hashtags = finalPost.hashtags || "#arizona #RealEstate #TheJakobovGroup";
  finalPost.status = "Drafting";
  finalPost.weekKey = getArizonaWeekKey();
  finalPost.dateCreated = todayArizonaISO();
  finalPost.checklist = finalPost.checklist || Object.fromEntries(triviaChecklistItems.map((item) => [item, false]));
  state.weeklyTriviaPosts[finalPost.weekKey] = finalPost;
  state.triviaHistory = [finalPost.topic, ...(state.triviaHistory || []).filter((topic) => topic !== finalPost.topic)].slice(0, 8);
  saveState();
  renderTriviaPost();
  renderFocus();
  showToast("Weekly Arizona trivia post generated.");
}

function renderTriviaPost() {
  const post = getCurrentTriviaPost();
  const dueToday = isWednesdayArizona();
  const card = document.querySelector("#weeklyTriviaCard");
  if (!card) return;
  card.classList.toggle("ready", dueToday && !["Posted", "Completed"].includes(post.status));
  document.querySelector("#triviaStatusPill").textContent = dueToday ? "Due Today" : "Due Wednesday";
  document.querySelector("#triviaReminderText").textContent = dueToday
    ? "Weekly Arizona trivia post is due today. Review the copy, design the carousel, then post manually."
    : "Weekly Arizona trivia post appears every Wednesday morning Arizona time.";
  document.querySelector("#triviaTopic").value = post.topic || "";
  document.querySelector("#triviaSlide1").value = post.slide1Text || "";
  document.querySelector("#triviaSlide2").value = post.slide2Text || "";
  document.querySelector("#triviaCaption").value = post.caption || "";
  document.querySelector("#triviaHashtags").value = post.hashtags || "#arizona #RealEstate #TheJakobovGroup";
  document.querySelector("#triviaBackground1").value = post.backgroundImage1 || "";
  document.querySelector("#triviaBackground2").value = post.backgroundImage2 || "";
  document.querySelector("#triviaStatus").value = post.status || "Idea";
  document.querySelector("#triviaDateCreated").value = post.dateCreated || todayArizonaISO();
  document.querySelector("#triviaDatePosted").value = post.datePosted || "";
  const checklist = document.querySelector("#triviaChecklist");
  checklist.innerHTML = triviaChecklistItems.map((item) => `
    <label class="mini-check">
      <input type="checkbox" data-trivia-check="${escapeHTML(item)}" ${post.checklist?.[item] ? "checked" : ""}>
      <span>${escapeHTML(item)}</span>
    </label>
  `).join("");
}

function priorityRank(priority) {
  return priorities.indexOf(priority);
}

function getOpenTaskCount() {
  return state.tasks.filter((task) => task.status !== "Completed").length;
}

function getListingsNeedingActionCount() {
  return (state.socialPosts || []).filter((post) => !isSocialPostCompleted(post) && !["Posted", "Completed", "Canceled", "Duplicate or Cancelled"].includes(post.statusWorkflow)).length;
}

function getWaitingTaskCount() {
  return state.tasks.filter((task) => task.status.startsWith("Waiting")).length;
}

function getCompletedThisWeekCount() {
  return state.tasks.filter((task) => task.status === "Completed" && (!task.due || isDateThisWeek(task.due))).length;
}

function renderDashboardKpis() {
  const container = document.querySelector("#dashboardKpis");
  if (!container) return;
  const trivia = getCurrentTriviaPost();
  const payment = getCurrentPaymentRequest();
  const paymentStatus = payment.sent ? "Sent" : isFridayArizona() ? "Due Today" : "Due Friday";
  const triviaStatus = trivia?.status || "Idea";
  const cards = [
    ["Open Tasks", getOpenTaskCount(), "Active work queue"],
    ["Listings Needing Action", getListingsNeedingActionCount(), "Social workflow"],
    ["Trivia Status", triviaStatus, isWednesdayArizona() ? "Due today" : "Weekly post"],
    ["Payment Request", paymentStatus, isFridayArizona() ? "Friday reminder" : "Weekly workflow"],
    ["Waiting For Replies", getWaitingTaskCount(), "Follow ups"],
    ["Completed This Week", getCompletedThisWeekCount(), "Done items"]
  ];
  container.innerHTML = cards.map(([label, value, note]) => `
    <article class="dashboard-kpi-card">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(String(value))}</strong>
      <small>${escapeHTML(note)}</small>
    </article>
  `).join("");
}

function renderRecurringOverview() {
  const container = document.querySelector("#recurringReminderOverview");
  if (!container) return;
  const payment = getCurrentPaymentRequest();
  const trivia = getCurrentTriviaPost();
  const paymentStatus = payment.sent ? "Sent" : isFridayArizona() ? "Due Today" : "Scheduled";
  const triviaStatus = ["Posted", "Completed"].includes(trivia?.status) ? trivia.status : isWednesdayArizona() ? "Due Today" : trivia?.status || "Draft";
  container.innerHTML = `
    <article class="mini-reminder-card ${paymentStatus === "Due Today" ? "due" : ""}">
      <div>
        <span>Friday</span>
        <strong>Weekly Payment Request</strong>
        <p>Review hours, copy the message, and send it to Ari.</p>
      </div>
      <span class="status-pill">${escapeHTML(paymentStatus)}</span>
    </article>
    <article class="mini-reminder-card ${triviaStatus === "Due Today" ? "due" : ""}">
      <div>
        <span>Wednesday</span>
        <strong>Arizona Trivia Post</strong>
        <p>Prepare the carousel copy, design, caption, and manual post.</p>
      </div>
      <span class="status-pill">${escapeHTML(triviaStatus)}</span>
    </article>
  `;
}

function renderFocus() {
  const today = todayISO();
  const arizonaToday = todayArizonaISO();
  const active = state.tasks
    .filter((task) => task.status !== "Completed")
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));

  const top = active.filter((task) => task.due === today || task.priority === "Urgent" || task.priority === "High").slice(0, 3);
  const topTasks = document.querySelector("#topTasks");
  topTasks.innerHTML = "";
  const recurringFocus = [];
  if (isFridayArizona()) {
    const payment = getCurrentPaymentRequest();
    if (!payment.sent) recurringFocus.push("Weekly Payment Request: review hours, copy message, then send to Ari");
  }
  if (isWednesdayArizona()) {
    const trivia = getCurrentTriviaPost();
    if (trivia && !["Posted", "Completed"].includes(trivia.status)) recurringFocus.push("Weekly Arizona Trivia Post: review carousel copy and prepare design");
  }
  recurringFocus.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    topTasks.appendChild(item);
  });
  (top.length ? top : active.slice(0, 3)).forEach((task) => {
    if (topTasks.children.length >= 3) return;
    const item = document.createElement("li");
    item.textContent = `${task.title} (${task.category})`;
    topTasks.appendChild(item);
  });
  if (!topTasks.children.length) {
    const item = document.createElement("li");
    item.textContent = `No urgent tasks for ${arizonaToday}.`;
    topTasks.appendChild(item);
  }

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
  const taskLists = document.querySelectorAll("[data-task-list]");

  const filtered = state.tasks.filter((task) => {
    const categoryMatch = categoryFilter === "All" || task.category === categoryFilter;
    const statusMatch = statusFilter === "All" || task.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  if (!filtered.length) {
    taskLists.forEach((taskList) => {
      taskList.innerHTML = `<div class="empty-state">No tasks match these filters.</div>`;
    });
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
          <select data-task-action-select="${escapeHTML(task.id)}" aria-label="Action for ${escapeHTML(task.title)}">
            <option value="progress">Start</option>
            <option value="review">Review</option>
            <option value="complete">Done</option>
            <option value="delete">Delete</option>
          </select>
          <button data-task-action-run="${escapeHTML(task.id)}" type="button">Apply</button>
        </div>
      </td>
    </tr>
  `).join("");

  const table = `
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
  taskLists.forEach((taskList) => {
    taskList.innerHTML = table;
  });
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

}

function renderBrandingSettings() {
  const container = document.querySelector("#brandingSettings");
  if (!container) return;
  const rows = [
    ["Main Brand Name", brandConfig.mainBrandName],
    ["Sidebar Logo", brandConfig.sidebarLogo],
    ["Light Background Logo", brandConfig.lightBackgroundLogo],
    ["Luxury Logo", brandConfig.luxuryLogo],
    ["Regular Listing Logo", brandConfig.regularListingLogo],
    ["Primary Brand Color", brandConfig.primaryBrandColor],
    ["Accent Brand Color", brandConfig.accentBrandColor],
    ["Branding Mode", brandConfig.brandingMode]
  ];
  container.innerHTML = rows.map(([label, value]) => `
    <label class="brand-setting-field">
      ${escapeHTML(label)}
      <input value="${escapeHTML(value)}" readonly>
    </label>
  `).join("");

  const preview = document.querySelector("#brandingPreview");
  if (preview) {
    preview.innerHTML = `
      <div class="brand-preview-card dark">
        ${brandImageHTML(brandConfig.sidebarLogo, "Jakobov white logo", "settings-logo", brandConfig.mainBrandName)}
        <span>Sidebar default</span>
      </div>
      <div class="brand-preview-card">
        ${brandImageHTML(brandConfig.lightBackgroundLogo, "Jakobov dark logo", "settings-logo", brandConfig.mainBrandName)}
        <span>Light page areas</span>
      </div>
      <div class="brand-preview-card">
        ${brandImageHTML(brandConfig.luxuryLogo, "Luxury listing logo", "settings-logo wide", "Luxury")}
        <span>Listings $1,000,000+</span>
      </div>
      <div class="brand-preview-card">
        ${brandImageHTML(brandConfig.regularListingLogo, "eXp Realty listing logo", "settings-logo", "eXp Realty")}
        <span>Listings below $1,000,000</span>
      </div>
    `;
  }
}

function renderSecuritySettings() {
  const container = document.querySelector("#securitySettings");
  if (!container) return;
  const session = getStoredAuthSession();
  const rows = [
    ["Login enabled", "Yes"],
    ["Current user", session?.username || "Not logged in"],
    ["Session type", session?.sessionType || "None"]
  ];
  container.innerHTML = rows.map(([label, value]) => `
    <div class="security-setting-card">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(value)}</strong>
    </div>
  `).join("");
}

function renderFooterStatus() {
  const year = document.querySelector("#footerYear");
  if (year) year.textContent = String(new Date().getFullYear());
  const google = document.querySelector("#footerGoogleStatus");
  if (google) {
    const connected = Boolean(attendanceSyncUrl || socialPostsSyncUrl || gmailListingSyncUrl || brochureEmailSendUrl);
    google.textContent = connected ? "Google Sync Connected" : "Google Sync Missing";
  }
  const caption = document.querySelector("#footerCaptionStatus");
  if (caption) caption.textContent = "Caption Server Missing";
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

function setSocialPostSyncStatus(message) {
  const status = document.querySelector("#socialPostSyncStatus");
  if (status) status.textContent = message;
}

function setSocialPostPayloadPreview(payload) {
  const preview = document.querySelector("#socialPostPayloadPreview");
  if (!preview) return;
  if (!payload) {
    preview.hidden = true;
    preview.textContent = "";
    return;
  }
  preview.hidden = false;
  preview.textContent = typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
}

function getDriveFolderFileUrl(fileName) {
  return fileName ? `${agentHeadshotsFolderUrl}#${encodeURIComponent(fileName)}` : "";
}

function normalizeAgentToken(value) {
  return String(value || "").toLowerCase().replace(/[^a-z\s]/g, " ").trim().split(/\s+/).filter(Boolean);
}

function getHeadshotCandidates(agentName) {
  const tokens = normalizeAgentToken(agentName);
  const candidates = new Set();
  tokens.forEach((token) => {
    (agentHeadshotAliases[token] || []).forEach((file) => candidates.add(file));
    const direct = agentHeadshotFiles.filter((file) => file.toLowerCase().replace(/\d?\.jpe?g$/, "") === token);
    direct.forEach((file) => candidates.add(file));
  });
  if (!candidates.size && tokens.length) {
    const first = tokens[0];
    agentHeadshotFiles
      .filter((file) => file.toLowerCase().startsWith(first))
      .forEach((file) => candidates.add(file));
  }
  return Array.from(candidates);
}

function getSuggestedHeadshot(post) {
  const selected = post.agentHeadshotFile || post.agentHeadshotLink || "";
  if (selected) return { selected, candidates: getHeadshotCandidates(post.agentName) };
  const candidates = getHeadshotCandidates(post.agentName);
  return { selected: candidates[0] || "", candidates };
}

function getHeadshotLinkFromSelection(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return getDriveFolderFileUrl(value);
}
function parseMoneyValue(value) {
  const number = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function formatPriceLabel(value) {
  const number = parseMoneyValue(value);
  return number ? number.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : "Not set";
}

function getLogoTypeForPrice(value) {
  return parseMoneyValue(value) >= 1000000 ? "Luxury eXp" : "Regular eXp";
}

function getListingBranding(value) {
  const isLuxury = parseMoneyValue(value) >= 1000000;
  return {
    label: isLuxury ? "Luxury" : "eXp Realty",
    logoType: isLuxury ? "Luxury eXp" : "Regular eXp",
    logo: isLuxury ? brandConfig.luxuryLogo : brandConfig.regularListingLogo,
    className: isLuxury ? "luxury" : "regular"
  };
}

function brandImageHTML(src, alt, className = "", fallbackText = "") {
  return `
    <span class="brand-logo-wrap ${escapeHTML(className)}">
      <img src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false;">
      <span class="brand-logo-fallback" hidden>${escapeHTML(fallbackText || alt)}</span>
    </span>
  `;
}

function getAgentProfile(agentName) {
  const profiles = state.agentProfiles || {};
  const key = String(agentName || "").trim().toLowerCase();
  return profiles[key] || {};
}

function getAgentWarnings(post) {
  const profile = getAgentProfile(post.agentName);
  const warnings = [];
  if (!post.agentHeadshotLink && !getSuggestedHeadshot(post).selected) warnings.push("Agent headshot missing. Select manually before finalizing design.");
  if (!profile.phone && post.agentPhoneConfirmed !== "YES") warnings.push("Agent phone missing or not confirmed");
  if (!profile.email && post.agentEmailConfirmed !== "YES") warnings.push("Agent email missing or not confirmed");
  if (!profile.instagram && !post.agentInstagramHandle) warnings.push("Agent Instagram handle missing");
  return warnings;
}

function mapSocialSheetRow(row) {
  return {
    id: row.ID || "",
    dateReceived: row["Date Received"] || "",
    agentName: row["Agent Name"] || "",
    listingType: normalizeSocialListingType(row["Listing Type"] || "New Listing"),
    mlsNumber: row["MLS#"] || "",
    mlsLink: row["MLS Link"] || "",
    propertyAddress: row["Property Address"] || "",
    duplicateValidation: row["Duplicate Validation"] || "",
    price: row.Price || "",
    bedrooms: row.Bedrooms || "",
    bathrooms: row.Bathrooms || "",
    squareFeet: row["Approximate Square Feet"] || row["Approx. Sq Ft"] || "",
    mlsDescription: row["MLS Description"] || "",
    logoType: row["Logo Type"] || getLogoTypeForPrice(row.Price),
    statusWorkflow: row["Status (Workflow)"] || "New",
    subject: row.Subject || "",
    emailTemplate: row["Email Template"] || "",
    agentHeadshotLink: row["Agent Headshot Link"] || row["Agent Photo Link"] || "",
    agentHeadshotFile: row["Agent Headshot File"] || "",
    agentHeadshotFound: row["Agent Headshot Found"] || "",
    agentHeadshotConfirmed: row["Agent Headshot Confirmed"] || row["Agent Photo Confirmed"] || "NO",
    agentNameConfirmed: row["Agent Name Confirmed"] || "NO",
    agentPhoneConfirmed: row["Agent Phone Confirmed"] || "NO",
    agentEmailConfirmed: row["Agent Email Confirmed"] || "NO",
    agentInstagramHandle: row["Agent Instagram Handle"] || "",
    canvaVideoLink: row["Canva Video Link"] || "",
    graphicsCreated: row["Graphics Created?"] || "NO",
    posted: row.Posted || "NO",
    datePosted: row["Date Posted"] || "",
    graphicsLink: row["Graphics Link"] || "",
    igPostLink: row["IG Post Link"] || "",
    sourceEmailId: row["Source Email ID"] || "",
    sourceEmailSubject: row["Source Email Subject"] || "",
    sourceEmailDate: row["Source Email Date"] || "",
    dateProcessed: row["Date Processed"] || ""
  };
}

function socialPatchToSheetFields(patch) {
  const fieldMap = {
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
    agentInstagramHandleConfirmed: "Agent Instagram Handle Confirmed",
    agentNameConfirmed: "Agent Name Confirmed",
    agentPhoneConfirmed: "Agent Phone Confirmed",
    agentEmailConfirmed: "Agent Email Confirmed",
    agentInstagramHandle: "Agent Instagram Handle",
    canvaVideoLink: "Canva Video Link",
    caption: "Caption"
  };
  return Object.fromEntries(
    Object.entries(patch)
      .filter(([key]) => fieldMap[key])
      .map(([key, value]) => [fieldMap[key], value])
  );
}

async function syncSocialPostUpdate(id, patch) {
  const updates = socialPatchToSheetFields(patch);
  if (!Object.keys(updates).length) return;
  const payload = { id, updates };

  if (socialPostsSyncUrl && /^(LOCAL|SAMPLE)-/.test(String(id || ""))) {
    setSocialPostSyncStatus("Local task saved in this browser. Google Sheets updates need a sheet row ID.");
    return;
  }

  if (!socialPostsSyncUrl) {
    setSocialPostPayloadPreview(payload);
    await copyText(JSON.stringify(payload, null, 2));
    setSocialPostSyncStatus("Social posts sync URL missing. Update saved locally. Payload is shown below and copied for manual use.");
    return;
  }

  setSocialPostPayloadPreview(null);
  setSocialPostSyncStatus(`Updating ${id} in Social Post Tasks...`);
  const response = await fetch(socialPostsSyncUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "Social post update failed.");
  setSocialPostSyncStatus(result.message || `Updated ${id} in Social Post Tasks.`);
}

async function syncSocialPostsFromSheet() {
  if (!socialPostsSyncUrl) {
    setSocialPostPayloadPreview(null);
    setSocialPostSyncStatus("Google Sheets sync URL missing. Add the Social Post Tasks Apps Script URL to app.js.");
    showToast("Social posts sync URL is not set yet.");
    return;
  }

  setSocialPostSyncStatus("Loading active Social Post Tasks from Google Sheets...");
  const response = await fetch(socialPostsSyncUrl);
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "Social post sync failed.");

  const sheetPosts = (result.rows || []).map(mapSocialSheetRow);
  setSocialPostPayloadPreview(null);
  const localOnlyPosts = state.socialPosts.filter((post) => String(post.id || "").startsWith("LOCAL-"));
  state.socialPosts = [...sheetPosts, ...localOnlyPosts];
  saveState();
  renderSocialPosts();
  setSocialPostSyncStatus(result.message || `Loaded ${sheetPosts.length} active social post tasks.`);
  showToast(`Loaded ${sheetPosts.length} social post tasks.`);
}

function summarizeListingEmailSync(result, dryRun = false) {
  return `${dryRun ? "Test complete" : "Email sync complete"}: processed ${result.processedCount || 0}, created ${result.createdCount || 0}, duplicates ${result.duplicateCount || 0}, needs review ${result.needsReviewCount || 0}, skipped ${result.skippedCount || 0}.`;
}

async function syncListingEmails(options = {}) {
  const dryRun = Boolean(options.dryRun);
  const afterDate = options.afterDate || "";
  const maxResults = options.maxResults || "";
  if (!gmailListingSyncUrl) {
    setSocialPostSyncStatus("Gmail listing sync URL missing. Add the Gmail Listing Sync Apps Script URL to app.js.");
    showToast("Gmail listing sync URL is not set yet.");
    return;
  }

  const params = new URLSearchParams({ dryRun: dryRun ? "true" : "false" });
  if (afterDate) params.set("afterDate", afterDate);
  if (maxResults) params.set("maxResults", String(maxResults));
  const url = `${gmailListingSyncUrl}${gmailListingSyncUrl.includes("?") ? "&" : "?"}${params.toString()}`;
  setSocialPostSyncStatus(dryRun ? "Testing Gmail listing sync without changing Gmail or Sheets..." : "Syncing Listing Updates emails...");
  const response = await fetch(url);
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "Gmail listing sync failed.");

  const summary = summarizeListingEmailSync(result, dryRun);
  setSocialPostSyncStatus(summary);
  showToast(summary);
  console.info("VA Command Center Gmail listing sync result", result);
  if (!dryRun) {
    await syncSocialPostsFromSheet();
  }
}

function getSampleSocialPosts() {
  const baseDate = todayArizonaISO();
  const sampleImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1080' height='1350' viewBox='0 0 1080 1350'%3E%3Crect width='1080' height='1350' fill='%23edf7f6'/%3E%3Ctext x='540' y='675' text-anchor='middle' font-family='Arial' font-size='54' fill='%23007466'%3EProcessed Sample%3C/text%3E%3C/svg%3E";
  return [
    {
      id: "SAMPLE-COMING-SOON",
      dateReceived: baseDate,
      agentName: "Steele Nash",
      listingType: "Coming Soon",
      mlsNumber: "SAMPLE1001",
      mlsLink: "https://example.com/mls/SAMPLE1001",
      propertyAddress: "42610 N 22ND ST, Phoenix, AZ 85086",
      price: "$1,250,000",
      bedrooms: "4",
      bathrooms: "3",
      squareFeet: "3,210",
      mlsDescription: "Private desert living with elevated finishes, open gathering spaces, and mountain views.",
      duplicateValidation: "Sample unique task",
      statusWorkflow: "Needs Design",
      logoType: "Luxury eXp",
      agentInstagramHandle: "@steelenash",
      graphicsCreated: "NO",
      posted: "NO",
      isSample: true
    },
    {
      id: "SAMPLE-NEW-LISTING",
      dateReceived: baseDate,
      agentName: "Ari Jakobov",
      listingType: "New Listing",
      mlsNumber: "SAMPLE1002",
      propertyAddress: "9914 W BRIGHT ANGEL CIR, Sun City, AZ 85351",
      price: "$425,000",
      statusWorkflow: "New",
      logoType: "Regular eXp",
      agentInstagramHandle: "@arijakobov",
      graphicsCreated: "NO",
      posted: "NO",
      isSample: true
    },
    {
      id: "SAMPLE-ACTIVE",
      dateReceived: baseDate,
      agentName: "Stephanie Pieper",
      listingType: "Active",
      mlsNumber: "SAMPLE1003",
      propertyAddress: "7445 W YUKON DR, Peoria, AZ 85382",
      price: "$735,000",
      statusWorkflow: "Needs Photos",
      logoType: "Regular eXp",
      agentInstagramHandle: "@stephpieper",
      graphicsCreated: "YES",
      posted: "NO",
      isSample: true
    },
    {
      id: "SAMPLE-PENDING",
      dateReceived: baseDate,
      agentName: "Catherine",
      listingType: "Pending",
      mlsNumber: "SAMPLE1004",
      propertyAddress: "1842 E DESERT LN, Phoenix, AZ 85042",
      price: "$899,000",
      statusWorkflow: "Needs Caption",
      logoType: "Regular eXp",
      agentInstagramHandle: "@catherine",
      graphicsCreated: "YES",
      posted: "NO",
      isSample: true
    },
    {
      id: "SAMPLE-UNDER-CONTRACT",
      dateReceived: baseDate,
      agentName: "James",
      listingType: "Under Contract",
      mlsNumber: "SAMPLE1005",
      propertyAddress: "3120 N 57TH PL, Scottsdale, AZ 85251",
      price: "$1,050,000",
      statusWorkflow: "Caption Ready",
      logoType: "Luxury eXp",
      agentInstagramHandle: "@james",
      caption: "UNDER CONTRACT\n3120 N 57TH PL, Scottsdale, AZ 85251\n\nA polished Scottsdale residence is now under contract.\n\nFeature breakdown:\n4 bedrooms\n3 bathrooms\n\nExclusively listed by @james and @thejakobovgroup\n\n#arizona #RealEstate #TheJakobovGroup",
      graphicsCreated: "YES",
      posted: "NO",
      isSample: true
    },
    {
      id: "SAMPLE-CLOSED",
      dateReceived: baseDate,
      agentName: "Sam",
      listingType: "Closed",
      mlsNumber: "SAMPLE1006",
      propertyAddress: "1010 E CAMELBACK RD, Phoenix, AZ 85014",
      price: "$675,000",
      statusWorkflow: "Ready To Send To WhatsApp",
      logoType: "Regular eXp",
      agentInstagramHandle: "@sam",
      graphicsCreated: "YES",
      posted: "NO",
      processedPhotos: { "Living Room": sampleImage, Kitchen: sampleImage },
      caption: "CLOSED\n1010 E CAMELBACK RD, Phoenix, AZ 85014\n\nAnother strong Phoenix result for our clients.\n\nExclusively listed by @sam and @thejakobovgroup\n\n#arizona #RealEstate #TheJakobovGroup",
      isSample: true
    },
    {
      id: "SAMPLE-CANCELED",
      dateReceived: baseDate,
      agentName: "Joe",
      listingType: "Canceled",
      mlsNumber: "SAMPLE1007",
      propertyAddress: "2020 W SAMPLE AVE, Glendale, AZ 85301",
      price: "$500,000",
      statusWorkflow: "Canceled",
      duplicateValidation: "Sample canceled task",
      logoType: "Regular eXp",
      posted: "NO",
      isSample: true
    },
    {
      id: "SAMPLE-MISSING-MLS",
      dateReceived: baseDate,
      agentName: "Kath",
      listingType: "New Listing",
      mlsNumber: "",
      propertyAddress: "5050 N SAMPLE WAY, Phoenix, AZ 85018",
      price: "$1,300,000",
      statusWorkflow: "New",
      logoType: "Luxury eXp",
      agentInstagramHandle: "@kath",
      duplicateValidation: "Missing MLS sample",
      posted: "NO",
      isSample: true
    },
    {
      id: "SAMPLE-MISSING-HANDLE",
      dateReceived: baseDate,
      agentName: "Svetlana",
      listingType: "Pending",
      mlsNumber: "SAMPLE1008",
      propertyAddress: "6060 E SAMPLE CT, Mesa, AZ 85205",
      price: "$640,000",
      statusWorkflow: "Needs Caption",
      logoType: "Regular eXp",
      agentInstagramHandle: "",
      posted: "NO",
      isSample: true
    },
    {
      id: "SAMPLE-DUPLICATE",
      dateReceived: baseDate,
      agentName: "Steele Nash",
      listingType: "Coming Soon",
      mlsNumber: "SAMPLE1001",
      propertyAddress: "42610 N 22ND ST, Phoenix, AZ 85086",
      price: "$1,250,000",
      statusWorkflow: "Canceled",
      duplicateValidation: "Duplicate sample: same MLS# plus same Listing Type",
      logoType: "Luxury eXp",
      posted: "NO",
      isSample: true
    }
  ];
}

function loadSampleSocialPosts() {
  const existingNonSamples = state.socialPosts.filter((post) => !post.isSample);
  if (state.socialPosts.length && !window.confirm("Load sample social posts? Existing real/synced tasks will stay, and old samples will be replaced.")) return;
  state.socialPosts = [...getSampleSocialPosts(), ...existingNonSamples];
  saveState();
  renderSocialPosts();
  setSocialPostSyncStatus("Sample social posts loaded locally. They will not sync to Google Sheets unless you manually copy a payload.");
  showToast("Sample social posts loaded.");
}

function clearSampleSocialPosts() {
  const sampleCount = state.socialPosts.filter((post) => post.isSample || String(post.id || "").startsWith("SAMPLE-")).length;
  if (!sampleCount) {
    showToast("No sample social posts to clear.");
    return;
  }
  if (!window.confirm(`Clear ${sampleCount} sample social post tasks? Real/synced tasks will stay.`)) return;
  state.socialPosts = state.socialPosts.filter((post) => !post.isSample && !String(post.id || "").startsWith("SAMPLE-"));
  saveState();
  renderSocialPosts();
  showToast("Sample social posts cleared.");
}

function normalizeSocialListingType(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text.includes("coming")) return "Coming Soon";
  if (text.includes("under")) return "Under Contract";
  if (text.includes("pending")) return "Pending";
  if (text.includes("closed") || text.includes("sold")) return "Closed";
  if (text.includes("active")) return "Active";
  if (text.includes("new")) return "New Listing";
  return String(value || "New Listing").trim() || "New Listing";
}

function socialStatusClass(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isSocialPostCompleted(post) {
  const status = String(post.statusWorkflow || "").toLowerCase();
  return post.posted === "YES" || status === "completed";
}

function isDateThisWeek(isoDate) {
  if (!isoDate) return false;
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
}

function getSocialPostTitle(post) {
  return `${post.listingType || "Listing"} \u2022 ${post.propertyAddress || "No address"} \u2022 ${post.agentName || "No agent"}`;
}

function getSocialPostById(id) {
  return state.socialPosts.find((post) => post.id === id);
}

function updateSocialPost(id, patch, options = {}) {
  const post = getSocialPostById(id);
  if (!post) return null;
  Object.assign(post, patch);
  saveState();
  renderSocialPosts();
  if (options.sync !== false) {
    syncSocialPostUpdate(id, patch).catch((error) => {
      setSocialPostSyncStatus(`Social post update failed: ${error.message}`);
      showToast("Social post sheet update failed.");
    });
  }
  return post;
}

function getVisibleSocialPosts() {
  const term = socialPostSearchTerm.trim().toLowerCase();
  return state.socialPosts.filter((post) => {
    const status = post.statusWorkflow || "New";
    const type = post.listingType || "";
    const duplicate = String(post.duplicateValidation || "").toLowerCase().includes("duplicate") || status === "Duplicate or Cancelled";

    if (activeSocialPostFilter === "All" && isSocialPostCompleted(post)) return false;
    if (["Coming Soon", "New Listing", "Active", "Pending", "Under Contract", "Closed", "Canceled"].includes(activeSocialPostFilter) && type !== activeSocialPostFilter) return false;
    if (socialWorkflowStatuses.includes(activeSocialPostFilter) && status !== activeSocialPostFilter) return false;
    if (activeSocialPostFilter === "Duplicate" && !duplicate) return false;

    if (!term) return true;
    return [post.propertyAddress, post.mlsNumber, post.agentName, post.agentInstagramHandle].some((value) => String(value || "").toLowerCase().includes(term));
  });
}

function isDuplicateSocialPost(post) {
  const status = String(post.statusWorkflow || "");
  return String(post.duplicateValidation || "").toLowerCase().includes("duplicate") || status === "Duplicate or Cancelled";
}

function getPendingListingPosts() {
  return (state.socialPosts || []).filter((post) => {
    const status = String(post.statusWorkflow || "New");
    return !isSocialPostCompleted(post) && !isDuplicateSocialPost(post) && !["Canceled", "Posted", "Completed"].includes(status);
  });
}

function renderPendingListingPosts() {
  const count = document.querySelector("#pendingListingPostsCount");
  const list = document.querySelector("#pendingListingPostsList");
  if (!list) return;
  const pendingPosts = getPendingListingPosts();
  if (count) count.textContent = `${pendingPosts.length} Pending`;
  if (!pendingPosts.length) {
    list.innerHTML = `<div class="empty-state">No pending listing posts right now.</div>`;
    return;
  }
  list.innerHTML = pendingPosts.map((post) => {
    const branding = getListingBranding(post.price);
    return `
      <article class="pending-post-row">
        <div>
          <strong>${escapeHTML(post.propertyAddress || "Address needed")}</strong>
          <span>${escapeHTML(post.listingType || "Listing")} • ${escapeHTML(post.agentName || "Agent needed")} • MLS ${escapeHTML(post.mlsNumber || "missing")}</span>
        </div>
        <div class="pending-post-meta">
          <span class="status-pill">${escapeHTML(post.statusWorkflow || "New")}</span>
          <span class="brand-pill ${escapeHTML(branding.className)}">${escapeHTML(branding.label)}</span>
          <span>${escapeHTML(post.dateReceived || "No date")}</span>
        </div>
        <div class="pending-post-actions">
          <button data-pending-action="caption" data-id="${escapeHTML(post.id)}" type="button">Caption</button>
          <button data-pending-action="whatsapp" data-id="${escapeHTML(post.id)}" type="button" class="quiet">WhatsApp</button>
          <button data-pending-action="posted" data-id="${escapeHTML(post.id)}" type="button" class="quiet">Mark Posted</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderSocialPostSummary() {
  const summary = document.querySelector("#socialPostSummary");
  if (!summary) return;
  const countByStatus = (status) => state.socialPosts.filter((post) => post.statusWorkflow === status && !isSocialPostCompleted(post)).length;
  const postedCount = state.socialPosts.filter((post) => post.posted === "YES" || post.statusWorkflow === "Posted").length;
  const postedThisWeek = state.socialPosts.filter((post) => post.posted === "YES" && isDateThisWeek(post.datePosted)).length;
  summary.innerHTML = `
    <article class="metric compact-metric"><span>New</span><strong>${countByStatus("New")}</strong></article>
    <article class="metric compact-metric"><span>Needs Design</span><strong>${countByStatus("Needs Design")}</strong></article>
    <article class="metric compact-metric"><span>Needs Photos</span><strong>${countByStatus("Needs Photos")}</strong></article>
    <article class="metric compact-metric"><span>Photo Prep Ready</span><strong>${countByStatus("Photo Prep Ready")}</strong></article>
    <article class="metric compact-metric"><span>Needs Caption</span><strong>${countByStatus("Needs Caption")}</strong></article>
    <article class="metric compact-metric"><span>Caption Ready</span><strong>${countByStatus("Caption Ready")}</strong></article>
    <article class="metric compact-metric"><span>Ready To WhatsApp</span><strong>${countByStatus("Ready To Send To WhatsApp")}</strong></article>
    <article class="metric compact-metric"><span>Posted</span><strong>${postedCount}</strong></article>
    <article class="metric compact-metric"><span>Posted This Week</span><strong>${postedThisWeek}</strong></article>
  `;
}

function renderSocialPostFilters() {
  const filters = document.querySelector("#socialPostFilters");
  if (!filters) return;
  filters.innerHTML = `
    <label class="filter-select-field">
      View
      <select id="socialPostFilterSelect" aria-label="Filter listing social posts">
        ${socialPostFilters.map((filter) => `
          <option value="${escapeHTML(filter)}" ${filter === activeSocialPostFilter ? "selected" : ""}>${escapeHTML(filter)}</option>
        `).join("")}
      </select>
    </label>
  `;
}

function socialField(label, value, link = false) {
  const safeValue = value ? escapeHTML(value) : "Not set";
  const content = link && value ? `<a href="${escapeHTML(value)}" target="_blank" rel="noreferrer">Open link</a>` : safeValue;
  return `<div class="social-field"><span>${escapeHTML(label)}</span><strong>${content}</strong></div>`;
}

function socialInputField(label, field, value, type = "text") {
  return `
    <label class="social-edit-field">
      ${escapeHTML(label)}
      <input data-social-edit="${escapeHTML(field)}" type="${escapeHTML(type)}" value="${escapeHTML(value || "")}">
    </label>
  `;
}

function socialTextareaField(label, field, value) {
  return `
    <label class="social-edit-field wide">
      ${escapeHTML(label)}
      <textarea data-social-edit="${escapeHTML(field)}">${escapeHTML(value || "")}</textarea>
    </label>
  `;
}

function renderHeadshotSelector(post) {
  const suggestion = getSuggestedHeadshot(post);
  const candidates = suggestion.candidates.length ? suggestion.candidates : agentHeadshotFiles;
  const selected = post.agentHeadshotFile || (suggestion.selected && !/^https?:\/\//i.test(suggestion.selected) ? suggestion.selected : "");
  const link = post.agentHeadshotLink || getHeadshotLinkFromSelection(selected || suggestion.selected);
  return `
    <div class="headshot-selector">
      <div>
        <span>Official source</span>
        <a href="${escapeHTML(agentHeadshotsFolderUrl)}" target="_blank" rel="noreferrer">Open Agent Headshots folder</a>
      </div>
      <label>
        Suggested headshot
        <select data-social-edit="agentHeadshotFile">
          <option value="">Select manually</option>
          ${candidates.map((file) => `<option value="${escapeHTML(file)}" ${file === selected ? "selected" : ""}>${escapeHTML(file)}</option>`).join("")}
        </select>
      </label>
      <label>
        Headshot link override
        <input data-social-edit="agentHeadshotLink" value="${escapeHTML(link)}" placeholder="Paste Drive file link or keep suggested folder reference">
      </label>
      <p class="small-muted">${suggestion.candidates.length > 1 ? "Multiple possible headshots found. Choose the correct one before Canva design." : suggestion.selected ? "Suggested from agent name." : "Agent headshot missing. Select manually before finalizing design."}</p>
    </div>
  `;
}
function renderVerificationChecks(post) {
  const checks = [
    ["agentHeadshotFound", "Agent Headshot Found"],
    ["agentHeadshotConfirmed", "Agent Headshot Confirmed"],
    ["agentNameConfirmed", "Correct agent name"],
    ["agentPhoneConfirmed", "Correct phone number"],
    ["agentEmailConfirmed", "Correct email address"],
    ["agentInstagramHandleConfirmed", "Agent Instagram Handle Confirmed"]
  ];
  return checks.map(([field, label]) => `
    <label class="mini-check">
      <input type="checkbox" data-social-check="${field}" data-id="${escapeHTML(post.id)}" ${post[field] === "YES" ? "checked" : ""}>
      <span>${label}</span>
    </label>
  `).join("");
}

function renderPhotoPrepForPost(post) {
  const processed = post.processedPhotos || {};
  return socialPhotoSlots.map((slot) => {
    const dataUrl = processed[slot] || "";
    const fileName = makePhotoFileName(slot, post.propertyAddress || post.mlsNumber || "listing");
    return `
      <article class="listing-photo-slot">
        <div>
          <strong>${escapeHTML(slot)}</strong>
          <span>${dataUrl ? "Ready, 1080 x 1350 JPG" : "Needs photo"}</span>
        </div>
        <input type="file" accept="image/*" data-listing-photo="${escapeHTML(slot)}" data-id="${escapeHTML(post.id)}">
        <div class="listing-photo-preview" data-listing-photo-preview="${escapeHTML(post.id)}-${escapeHTML(slot)}">
          ${dataUrl ? `<img src="${dataUrl}" alt="${escapeHTML(slot)} preview">` : `<span>No processed image yet.</span>`}
        </div>
        ${dataUrl ? `<a class="download-link" href="${dataUrl}" download="${escapeHTML(fileName)}">Download JPG</a>` : ""}
      </article>
    `;
  }).join("");
}

function getSocialQuickActionOptions() {
  return [
    ["save-details", "Save Details"],
    ["generate-caption", "Generate Caption"],
    ["copy-caption", "Copy Caption"],
    ["open-mls", "Open MLS Link"],
    ["graphics-link", "Add Graphics Link"],
    ["ig-link", "Save IG Post Link"],
    ["whatsapp", "Prepare WhatsApp Handoff"],
    ["mark-posted", "Mark Posted"],
    ["mark-needs-design", "Mark Needs Design"],
    ["mark-design-done", "Mark Design Done"],
    ["mark-needs-photos", "Mark Needs Photos"],
    ["mark-photos-selected", "Mark Photos Selected"],
    ["mark-photo-prep-ready", "Mark Photo Prep Ready"],
    ["mark-caption-ready", "Mark Caption Ready"],
    ["mark-ready-whatsapp", "Mark Ready To Send To WhatsApp"]
  ].map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
}

function renderSocialPostTableRow(post) {
  const status = post.statusWorkflow || "New";
  const listingBranding = getListingBranding(post.price);
  const logoType = post.logoType || listingBranding.logoType;
  const warnings = getAgentWarnings(post);
  const workflowOptions = socialWorkflowStatuses.map((workflow) => `
    <option value="${escapeHTML(workflow)}" ${workflow === status ? "selected" : ""}>${escapeHTML(workflow)}</option>
  `).join("");
  const quickActionOptions = getSocialQuickActionOptions();

  return `
    <tr class="social-post-table-row status-${socialStatusClass(status)}">
      <td>
        <strong>${escapeHTML(post.propertyAddress || "Address needed")}</strong>
        <span>${escapeHTML(post.id || "No ID")} • ${escapeHTML(post.listingType || "Listing")}</span>
        ${warnings.length ? `<span class="warning-line">${escapeHTML(warnings.join(". "))}</span>` : ""}
      </td>
      <td>${escapeHTML(post.agentName || "Agent needed")}</td>
      <td>${escapeHTML(post.mlsNumber || "Missing")}</td>
      <td>${escapeHTML(formatPriceLabel(post.price) || "No price")}</td>
      <td>
        <div class="listing-brand-stack table-brand">
          <span class="brand-pill ${escapeHTML(listingBranding.className)}">${escapeHTML(listingBranding.label)}</span>
        </div>
      </td>
      <td>
        <div class="social-table-control">
          <select data-social-workflow-select="${escapeHTML(post.id)}" aria-label="Workflow for ${escapeHTML(post.propertyAddress || post.id)}">
            ${workflowOptions}
          </select>
        </div>
      </td>
      <td>
        <div class="social-table-actions">
          <select data-social-action-select="${escapeHTML(post.id)}" aria-label="Quick action for ${escapeHTML(post.propertyAddress || post.id)}">
            ${quickActionOptions}
          </select>
          <button data-social-action-run="${escapeHTML(post.id)}" type="button">Run Action</button>
        </div>
      </td>
    </tr>
    <tr class="social-post-detail-row">
      <td colspan="7">
        <details class="listing-detail-panel social-post-detail" data-social-edit-container="${escapeHTML(post.id)}">
          <summary>Details, links, agent check, caption, and photo prep</summary>
          <div class="social-field-grid compact">
            ${socialField("Date Received", post.dateReceived)}
            ${socialField("Listing Type", post.listingType)}
            ${socialField("Logo Type", logoType)}
            ${socialField("MLS Link", post.mlsLink, true)}
            ${socialField("Agent Headshot", post.agentHeadshotLink || getHeadshotLinkFromSelection(post.agentHeadshotFile || getSuggestedHeadshot(post).selected), true)}
            ${socialField("Duplicate Validation", post.duplicateValidation)}
            ${socialField("Canva Video", post.canvaVideoLink, true)}
            ${socialField("Graphics Link", post.graphicsLink, true)}
            ${socialField("IG Post Link", post.igPostLink, true)}
          </div>
          <div class="social-edit-grid">
            ${renderHeadshotSelector(post)}
            ${socialInputField("Agent Instagram Handle", "agentInstagramHandle", post.agentInstagramHandle || getAgentProfile(post.agentName).instagram || "")}
            ${socialInputField("Price", "price", post.price || "")}
            ${socialInputField("Bedrooms", "bedrooms", post.bedrooms || "")}
            ${socialInputField("Bathrooms", "bathrooms", post.bathrooms || "")}
            ${socialInputField("Approximate Square Feet", "squareFeet", post.squareFeet || "")}
            ${socialInputField("Canva Video Link", "canvaVideoLink", post.canvaVideoLink || "")}
            ${socialTextareaField("MLS Description", "mlsDescription", post.mlsDescription || "")}
          </div>
          <div class="mini-check-grid">${renderVerificationChecks(post)}</div>
          <div class="listing-photo-grid">${renderPhotoPrepForPost(post)}</div>
          ${post.caption ? `<textarea class="caption-preview" readonly>${escapeHTML(post.caption)}</textarea>` : ""}
        </details>
      </td>
    </tr>
  `;
}

function renderSocialPostTable(posts) {
  return `
    <div class="table-wrap social-post-table-wrap">
      <table class="work-table social-post-table">
        <thead>
          <tr>
            <th>Listing</th>
            <th>Agent</th>
            <th>MLS</th>
            <th>Price</th>
            <th>Branding</th>
            <th>Workflow</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${posts.map(renderSocialPostTableRow).join("")}</tbody>
      </table>
    </div>
  `;
}

function renderSocialPosts() {
  if (!Array.isArray(state.socialPosts)) state.socialPosts = [];
  if (!state.agentProfiles) state.agentProfiles = {};
  renderSocialPostSummary();
  renderPendingListingPosts();
  renderSocialPostFilters();
  setSocialPostSyncStatus(socialPostsSyncUrl ? "Social posts sync: ready." : "Social posts sync: local only until the Apps Script URL is added.");
  const list = document.querySelector("#socialPostTrackerList");
  if (!list) return;
  const posts = getVisibleSocialPosts();
  if (!posts.length) {
    list.innerHTML = `<div class="empty-state">No active listing social post tasks match this view yet.</div>`;
    return;
  }
  list.innerHTML = renderSocialPostTable(posts);
}

function buildCaptionFromSocialPost(post) {
  const status = String(post.listingType || "NEW LISTING").toUpperCase();
  const profile = getAgentProfile(post.agentName);
  const agentText = String(post.agentInstagramHandle || profile.instagram || "").trim() || "@agenthandle";
  const details = [
    post.mlsDescription || "A polished Arizona listing with standout details and a strong market position.",
    post.bedrooms ? `${post.bedrooms} bedrooms` : "",
    post.bathrooms ? `${post.bathrooms} bathrooms` : "",
    post.squareFeet ? `${post.squareFeet} approximate square feet` : "",
    post.price ? `Listed at ${formatPriceLabel(post.price)}` : ""
  ].filter(Boolean).join(". ");
  return buildCaption({
    address: post.propertyAddress || "Property address needed",
    status,
    agent: agentText,
    details
  });
}

function fillCaptionBuilderFromSocialPost(post) {
  const caption = buildCaptionFromSocialPost(post);
  const agentText = String(post.agentInstagramHandle || getAgentProfile(post.agentName).instagram || "").trim() || "@agenthandle";
  document.querySelector("#captionAddress").value = post.propertyAddress || "";
  document.querySelector("#captionStatus").value = String(post.listingType || "NEW LISTING").toUpperCase();
  document.querySelector("#captionAgent").value = agentText;
  document.querySelector("#captionDetails").value = `${post.listingType || "Listing"} social post for ${post.propertyAddress || "property"}. MLS ${post.mlsNumber || "pending"}.`;
  document.querySelector("#captionOutput").value = caption;
  return caption;
}

function openLocalSocialPostModal() {
  const modal = document.querySelector("#socialPostModal");
  const form = document.querySelector("#socialPostForm");
  form?.reset();
  modal?.classList.add("open");
  modal?.setAttribute("aria-hidden", "false");
  document.querySelector("#localSocialAddress")?.focus();
}

function closeLocalSocialPostModal() {
  const modal = document.querySelector("#socialPostModal");
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
}

function createLocalSocialPostFromForm() {
  const propertyAddress = document.querySelector("#localSocialAddress")?.value.trim() || "";
  if (!propertyAddress) {
    showToast("Add the property address first.");
    return;
  }
  const listingType = normalizeSocialListingType(document.querySelector("#localSocialListingType")?.value || "New Listing");
  const id = `LOCAL-${Date.now()}`;
  state.socialPosts.unshift({
    id,
    dateReceived: todayArizonaISO(),
    agentName: document.querySelector("#localSocialAgent")?.value.trim() || "",
    listingType,
    mlsNumber: document.querySelector("#localSocialMls")?.value.trim() || "",
    mlsLink: document.querySelector("#localSocialMlsLink")?.value.trim() || "",
    price: document.querySelector("#localSocialPrice")?.value.trim() || "",
    bedrooms: document.querySelector("#localSocialBedrooms")?.value.trim() || "",
    bathrooms: document.querySelector("#localSocialBathrooms")?.value.trim() || "",
    squareFeet: document.querySelector("#localSocialSqft")?.value.trim() || "",
    mlsDescription: document.querySelector("#localSocialDescription")?.value.trim() || "",
    logoType: getLogoTypeForPrice(document.querySelector("#localSocialPrice")?.value.trim() || ""),
    propertyAddress,
    duplicateValidation: "Local task added manually",
    statusWorkflow: "New",
    subject: "Local listing social post task",
    emailTemplate: "",
    graphicsCreated: "NO",
    posted: "NO",
    datePosted: "",
    graphicsLink: "",
    igPostLink: ""
  });
  saveState();
  renderSocialPosts();
  syncSocialPostUpdate(id, { statusWorkflow: "New", graphicsCreated: "NO", posted: "NO" }).catch(() => {});
  closeLocalSocialPostModal();
  showToast("Local social post task added.");
}

function getSocialPostCardElement(id) {
  return document.querySelector(`[data-social-edit-container="${CSS.escape(id)}"]`)
    || document.querySelector(`.social-post-card button[data-id="${CSS.escape(id)}"]`)?.closest(".social-post-card");
}

function collectSocialPostDetailsFromCard(post) {
  const card = getSocialPostCardElement(post.id);
  if (!card) return {};
  const patch = {};
  card.querySelectorAll("[data-social-edit]").forEach((input) => {
    patch[input.dataset.socialEdit] = input.value.trim();
  });
  patch.logoType = getLogoTypeForPrice(patch.price || post.price);
  if (patch.agentHeadshotFile && !patch.agentHeadshotLink) patch.agentHeadshotLink = getDriveFolderFileUrl(patch.agentHeadshotFile);
  if (patch.agentHeadshotFile || patch.agentHeadshotLink) patch.agentHeadshotFound = "YES";
  return patch;
}

function buildCaptionPayload(post) {
  const profile = getAgentProfile(post.agentName);
  return {
    propertyAddress: post.propertyAddress,
    listingType: post.listingType,
    status: post.listingType,
    agentName: post.agentName,
    agentInstagramHandle: post.agentInstagramHandle || profile.instagram || "",
    mlsNumber: post.mlsNumber,
    mlsLink: post.mlsLink,
    price: post.price,
    soldPrice: post.soldPrice || "",
    bedrooms: post.bedrooms,
    bathrooms: post.bathrooms,
    squareFeet: post.squareFeet,
    description: post.mlsDescription,
    keyFeatures: "",
    notes: "Manual Instagram posting. No hyphens or em dashes."
  };
}

async function generateCaptionWithServer(post) {
  const payload = buildCaptionPayload(post);
  if (!payload.agentInstagramHandle) showToast("Agent handle missing. Add before finalizing caption.");
  const response = await fetch(captionServerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "Caption generation failed.");
  return result.caption;
}

async function generateCaptionFromBuilder() {
  const agentHandle = document.querySelector("#captionAgent").value.trim();
  if (!agentHandle) {
    showToast("Agent handle missing. Add before finalizing caption.");
    setSocialPostSyncStatus("Caption warning: agent handle is missing.");
  }
  const payload = {
    id: "CAPTION-BUILDER",
    propertyAddress: document.querySelector("#captionAddress").value.trim(),
    listingType: document.querySelector("#captionStatus").value,
    status: document.querySelector("#captionStatus").value,
    agentName: "",
    agentInstagramHandle: agentHandle,
    mlsDescription: document.querySelector("#captionDetails").value.trim(),
    description: document.querySelector("#captionDetails").value.trim()
  };
  const caption = await generateCaptionWithServer(payload);
  document.querySelector("#captionOutput").value = caption;
  showToast("Caption generated with ChatGPT.");
}

function buildWhatsAppHandoff(post) {
  const photoCount = Object.keys(post.processedPhotos || {}).length;
  const listingBranding = getListingBranding(post.price);
  const photoChecklist = socialPhotoSlots.map((slot) => {
    const ready = post.processedPhotos?.[slot] ? "READY" : "NEEDS PHOTO";
    return `${slot}: ${ready}`;
  }).join("\n");
  return `Listing package ready for Instagram

Property: ${post.propertyAddress || "Not set"}
Status: ${post.listingType || "Not set"}
Agent: ${post.agentName || "Not set"}
MLS: ${post.mlsNumber || "Not set"}
Branding: ${listingBranding.label}
Logo: ${post.logoType || listingBranding.logoType}
Agent headshot: ${post.agentHeadshotLink || getHeadshotLinkFromSelection(post.agentHeadshotFile) || "Not selected"}
Canva video: ${post.canvaVideoLink || post.graphicsLink || "Not added"}
Processed photos: ${photoCount}/6
${photoChecklist}

Caption:
${post.caption || "Caption not generated yet."}

Posting note: Post manually on phone, add music, then paste IG link back into VA Command Center.`;
}

function isInstagramUrl(value) {
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/i.test(String(value || "").trim());
}

function getWhatsAppHandoffWarnings(post) {
  const warnings = [];
  const selectedHeadshot = post.agentHeadshotLink || getHeadshotLinkFromSelection(post.agentHeadshotFile);
  const photoCount = Object.keys(post.processedPhotos || {}).length;
  if (!post.caption) warnings.push("Generate or paste the caption first.");
  if (!selectedHeadshot && post.agentHeadshotConfirmed !== "YES") warnings.push("Confirm or select the agent headshot.");
  if (!(post.agentInstagramHandle || getAgentProfile(post.agentName).instagram)) warnings.push("Agent handle missing. Add before finalizing caption.");
  if (!photoCount) warnings.push("At least one processed image should be ready before WhatsApp handoff.");
  return warnings;
}

async function processListingPhoto(postId, slot, file) {
  const post = getSocialPostById(postId);
  if (!post || !file) return;
  const output = document.querySelector(`[data-listing-photo-preview="${CSS.escape(`${postId}-${slot}`)}"]`);
  if (output) output.innerHTML = `<span>Processing...</span>`;
  const dataUrl = await createInstagramPhoto(file);
  const processedPhotos = { ...(post.processedPhotos || {}), [slot]: dataUrl };
  updateSocialPost(postId, { processedPhotos, statusWorkflow: Object.keys(processedPhotos).length >= 6 ? "Photo Prep Ready" : "Photos Selected" }, { sync: false });
}
function handleSocialPostAction(action, post) {
  if (!post) return;
  const workflowActionMap = {
    "mark-needs-design": "Needs Design",
    "mark-design-done": "Design Done",
    "mark-needs-photos": "Needs Photos",
    "mark-photos-selected": "Photos Selected",
    "mark-photo-prep-ready": "Photo Prep Ready",
    "mark-caption-ready": "Caption Ready",
    "mark-ready-whatsapp": "Ready To Send To WhatsApp"
  };
  if (workflowActionMap[action]) {
    if (action === "mark-ready-whatsapp") {
      const warnings = getWhatsAppHandoffWarnings(post);
      if (warnings.length && !window.confirm(`Ready To Send To WhatsApp has warnings:\n\n${warnings.join("\n")}\n\nContinue anyway?`)) {
        setSocialPostSyncStatus(`Ready To WhatsApp blocked: ${warnings.join(" ")}`);
        return;
      }
    }
    updateSocialPost(post.id, { statusWorkflow: workflowActionMap[action] });
    showToast(`Workflow moved to ${workflowActionMap[action]}.`);
    return;
  }
  if (action === "save-details") {
    const patch = collectSocialPostDetailsFromCard(post);
    updateSocialPost(post.id, patch);
    showToast("Listing details saved.");
    return;
  }
  if (action === "generate-caption") {
    const patch = collectSocialPostDetailsFromCard(post);
    const updated = updateSocialPost(post.id, patch, { sync: false }) || post;
    showToast("Generating caption...");
    generateCaptionWithServer(updated).then((caption) => {
      updateSocialPost(updated.id, { caption, statusWorkflow: "Caption Ready" });
      document.querySelector("#captionOutput").value = caption;
      showToast("Caption generated.");
    }).catch((error) => {
      const caption = buildCaptionFromSocialPost(updated);
      updateSocialPost(updated.id, { caption, statusWorkflow: "Caption Ready" }, { sync: false });
      document.querySelector("#captionOutput").value = caption;
      showToast("Caption server unavailable. Local draft created.");
      setSocialPostSyncStatus(`Caption server error: ${error.message}`);
    });
    return;
  }
  if (action === "build-caption") {
    fillCaptionBuilderFromSocialPost(post);
    if (post.statusWorkflow === "Needs Caption") updateSocialPost(post.id, { statusWorkflow: "Caption Ready" });
    showToast("Caption builder filled.");
    return;
  }
  if (action === "copy-caption") {
    const caption = post.caption || fillCaptionBuilderFromSocialPost(post);
    copyText(caption);
    return;
  }
  if (action === "open-mls") {
    if (!post.mlsLink) {
      showToast("No MLS link saved for this task.");
      return;
    }
    window.open(post.mlsLink, "_blank", "noreferrer");
    return;
  }
  if (action === "graphics-link") {
    const graphicsLink = window.prompt("Paste the graphics or Canva video link:", post.graphicsLink || post.canvaVideoLink || "");
    if (graphicsLink === null) return;
    updateSocialPost(post.id, { graphicsLink: graphicsLink.trim(), canvaVideoLink: graphicsLink.trim(), graphicsCreated: graphicsLink.trim() ? "YES" : post.graphicsCreated || "NO", statusWorkflow: graphicsLink.trim() ? "Design Done" : post.statusWorkflow });
    showToast("Graphics link updated.");
    return;
  }
  if (action === "ig-link") {
    const igPostLink = window.prompt("Paste the Instagram post link:", post.igPostLink || "");
    if (igPostLink === null) return;
    updateSocialPost(post.id, { igPostLink: igPostLink.trim() });
    showToast("Instagram link updated.");
    return;
  }
  if (action === "whatsapp") {
    const warnings = getWhatsAppHandoffWarnings(post);
    if (warnings.length && !window.confirm(`WhatsApp handoff has warnings:\n\n${warnings.join("\n")}\n\nCopy handoff anyway?`)) {
      setSocialPostSyncStatus(`WhatsApp handoff needs review: ${warnings.join(" ")}`);
      return;
    }
    const handoff = buildWhatsAppHandoff(post);
    updateSocialPost(post.id, { statusWorkflow: "Ready To Send To WhatsApp" });
    copyText(handoff);
    showToast("WhatsApp handoff copied.");
    return;
  }
  if (action === "mark-posted") {
    const igPostLink = window.prompt("Paste the Instagram post link to mark this as posted:", post.igPostLink || "");
    if (!igPostLink) {
      showToast("Instagram link is required before marking posted.");
      setSocialPostSyncStatus("Missing IG post link. Paste the Instagram URL before marking posted.");
      return;
    }
    if (!isInstagramUrl(igPostLink)) {
      showToast("That does not look like an Instagram post or reel URL.");
      setSocialPostSyncStatus("Missing valid IG post link. Use an Instagram /p/ or /reel/ URL.");
      return;
    }
    updateSocialPost(post.id, {
      igPostLink: igPostLink.trim(),
      posted: "YES",
      datePosted: todayArizonaISO(),
      statusWorkflow: "Completed"
    });
    showToast("Social post marked posted.");
  }
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
  let drawWidth = Math.min(width, instagramPhotoOutput.foregroundMaxWidth);
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
  canvas.width = instagramPhotoOutput.width;
  canvas.height = instagramPhotoOutput.height;
  const ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.filter = "blur(32px) brightness(0.82) saturate(1.04)";
  drawCoverImage(ctx, image, canvas.width, canvas.height);
  ctx.filter = "none";
  ctx.fillStyle = "rgba(17, 24, 39, 0.10)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawContainImage(ctx, image, canvas.width, canvas.height, instagramPhotoOutput.foregroundMaxHeight);

  return canvas.toDataURL("image/jpeg", instagramPhotoOutput.jpegQuality);
}

function makePhotoFileName(slot, prefix = "") {
  const safePrefix = String(prefix || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);
  const safeSlot = slot.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${safePrefix ? `${safePrefix}-` : ""}${safeSlot}-1080x1350.jpg`;
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
  renderPaymentRequest();
  renderDashboardKpis();
  renderRecurringOverview();
  renderTasks();
  renderSync();
  renderAttendance();
  renderCompliance();
  renderEndOfDayReport();
  renderSocialPosts();
  renderBrandingSettings();
  renderSecuritySettings();
  renderFooterStatus();
  renderTriviaPost();
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
  const cleanDetails = details.replace(/[\u2014\u2013-]/g, ",").trim();
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
    <div class="listing-card-head">
      <strong>Listing</strong>
      <button class="quiet remove-listing-btn" type="button" data-remove-listing aria-label="Remove listing">Remove</button>
    </div>
    <div class="listing-field-grid">
      <label>
        Agent name
        <input data-brochure-field="agentName" required placeholder="Agent name" value="${escapeHTML(listing.agentName || "")}">
      </label>
      <label class="field-wide">
        Address
        <input data-brochure-field="address" required placeholder="Property address" value="${escapeHTML(listing.address || "")}">
      </label>
      <label>
        MLS #
        <input data-brochure-field="mlsNumber" required placeholder="MLS number" value="${escapeHTML(listing.mlsNumber || "")}">
      </label>
      <label class="field-wide">
        MLS link
        <input data-brochure-field="mlsLink" required placeholder="Paste MLS link" value="${escapeHTML(listing.mlsLink || "")}">
      </label>
      <label>
        Price
        <input data-brochure-field="price" inputmode="decimal" placeholder="$0" value="${escapeHTML(listing.price || "")}">
      </label>
      <div class="logo-hint" data-logo-hint>Logo: EXP regular logo</div>
    </div>
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
  applyAuthState();
  const openVideoTemplateLink = document.querySelector("#openVideoTemplateLink");
  if (openVideoTemplateLink) {
    openVideoTemplateLink.href = canvaVideoTemplate.editUrl;
    openVideoTemplateLink.title = `${canvaVideoTemplate.name} Canva template`;
  }
  renderAll();

  document.querySelector("#loginForm")?.addEventListener("submit", handleLogin);
  document.querySelector("#logoutBtn")?.addEventListener("click", handleLogout);

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

  ["#paymentHours", "#paymentRate"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("input", updatePaymentTotalPreview);
  });
  ["#paymentStartDate", "#paymentEndDate", "#paymentHours", "#paymentRate", "#paymentSummary"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("change", () => {
      collectPaymentRequestFromForm();
      saveState();
      renderPaymentRequest();
    });
  });
  document.querySelector("#generatePaymentRequestBtn")?.addEventListener("click", () => {
    const payment = collectPaymentRequestFromForm();
    saveState();
    renderPaymentRequest();
    document.querySelector("#paymentMessageOutput").value = payment.message;
    showToast("Payment request generated.");
  });
  document.querySelector("#copyPaymentRequestBtn")?.addEventListener("click", () => {
    const payment = collectPaymentRequestFromForm();
    saveState();
    renderPaymentRequest();
    copyText(payment.message);
  });
  document.querySelector("#markPaymentSentBtn")?.addEventListener("click", () => {
    const payment = collectPaymentRequestFromForm();
    payment.sent = true;
    payment.sentDate = todayArizonaISO();
    saveState();
    renderPaymentRequest();
    renderFocus();
    showToast("Payment request marked sent for this Friday.");
  });

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

  document.querySelectorAll("[data-task-list]").forEach((taskList) => taskList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    let action = button.dataset.action;
    let taskId = button.dataset.id;
    if (button.dataset.taskActionRun) {
      taskId = button.dataset.taskActionRun;
      const select = taskList.querySelector(`select[data-task-action-select="${CSS.escape(taskId)}"]`);
      action = select?.value;
    }
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    if (action === "progress") task.status = "In Progress";
    if (action === "review") task.status = "Needs Review";
    if (action === "complete") task.status = "Completed";
    if (action === "delete") state.tasks = state.tasks.filter((item) => item.id !== task.id);
    saveState();
    renderAll();
  }));

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

  document.querySelector("#syncSocialPostsBtn")?.addEventListener("click", () => {
    syncSocialPostsFromSheet().catch((error) => {
      setSocialPostSyncStatus(`Social post sync failed: ${error.message}`);
      showToast("Social post sync failed.");
    });
  });
  document.querySelector("#syncListingEmailsBtn")?.addEventListener("click", () => {
    syncListingEmails({ dryRun: false }).catch((error) => {
      setSocialPostSyncStatus(`Gmail listing sync failed: ${error.message}`);
      showToast("Gmail listing sync failed.");
    });
  });
  document.querySelector("#dryRunListingEmailsBtn")?.addEventListener("click", () => {
    syncListingEmails({ dryRun: true }).catch((error) => {
      setSocialPostSyncStatus(`Gmail listing sync test failed: ${error.message}`);
      showToast("Gmail listing sync test failed.");
    });
  });
  document.querySelector("#backfillListingEmailsBtn")?.addEventListener("click", () => {
    syncListingEmails({ dryRun: false, afterDate: "2026-04-19", maxResults: 150 }).catch((error) => {
      setSocialPostSyncStatus(`Listing email backfill failed: ${error.message}`);
      showToast("Listing email backfill failed.");
    });
  });
  document.querySelector("#loadSampleSocialPostsBtn")?.addEventListener("click", loadSampleSocialPosts);
  document.querySelector("#clearSampleSocialPostsBtn")?.addEventListener("click", clearSampleSocialPosts);

  document.querySelector("#generateTriviaPostBtn")?.addEventListener("click", () => {
    generateWeeklyTriviaPost().catch((error) => {
      document.querySelector("#triviaGeneratorStatus").textContent = `Trivia generation failed: ${error.message}`;
      showToast("Trivia generation failed.");
    });
  });
  ["#triviaTopic", "#triviaSlide1", "#triviaSlide2", "#triviaCaption", "#triviaHashtags", "#triviaBackground1", "#triviaBackground2", "#triviaStatus", "#triviaDateCreated", "#triviaDatePosted"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("change", () => {
      collectTriviaPostFromForm();
      saveState();
      renderTriviaPost();
      renderFocus();
    });
  });
  document.querySelector("#triviaChecklist")?.addEventListener("change", (event) => {
    const check = event.target.closest("input[data-trivia-check]");
    if (!check) return;
    const post = getCurrentTriviaPost();
    post.checklist = post.checklist || {};
    post.checklist[check.dataset.triviaCheck] = check.checked;
    if (check.dataset.triviaCheck === "Mark completed" && check.checked) post.status = "Completed";
    saveState();
    renderTriviaPost();
    renderFocus();
  });
  document.querySelector("#copyTriviaSlide1Btn")?.addEventListener("click", () => {
    const post = collectTriviaPostFromForm();
    saveState();
    copyText(post.slide1Text);
  });
  document.querySelector("#copyTriviaSlide2Btn")?.addEventListener("click", () => {
    const post = collectTriviaPostFromForm();
    saveState();
    copyText(post.slide2Text);
  });
  document.querySelector("#copyTriviaCaptionBtn")?.addEventListener("click", () => {
    const post = collectTriviaPostFromForm();
    saveState();
    copyText(post.caption);
  });
  document.querySelector("#markTriviaReadyBtn")?.addEventListener("click", () => {
    const post = collectTriviaPostFromForm();
    post.status = "Ready To Post";
    post.checklist = { ...(post.checklist || {}), "Review caption": true, "Create carousel design": true };
    saveState();
    renderTriviaPost();
    renderFocus();
    showToast("Trivia post marked ready to post.");
  });
  document.querySelector("#markTriviaPostedBtn")?.addEventListener("click", () => {
    const post = collectTriviaPostFromForm();
    post.status = "Posted";
    post.datePosted = todayArizonaISO();
    post.checklist = { ...(post.checklist || {}), Post: true };
    saveState();
    renderTriviaPost();
    renderFocus();
    showToast("Trivia post marked posted.");
  });

  document.querySelector("#addLocalSocialPostBtn")?.addEventListener("click", openLocalSocialPostModal);

  document.querySelector(".listing-subnav")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-listing-jump]");
    if (!button) return;
    document.querySelector(`#${CSS.escape(button.dataset.listingJump)}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelector("#pendingListingPostsList")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-pending-action]");
    if (!button) return;
    const post = getSocialPostById(button.dataset.id);
    const actionMap = {
      caption: "generate-caption",
      whatsapp: "whatsapp",
      posted: "mark-posted"
    };
    handleSocialPostAction(actionMap[button.dataset.pendingAction], post);
  });

  document.querySelector("#closeSocialPostModalBtn")?.addEventListener("click", closeLocalSocialPostModal);
  document.querySelector("#cancelSocialPostModalBtn")?.addEventListener("click", closeLocalSocialPostModal);
  document.querySelector("#socialPostModal")?.addEventListener("click", (event) => {
    if (event.target.id === "socialPostModal") closeLocalSocialPostModal();
  });
  document.querySelector("#socialPostForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    createLocalSocialPostFromForm();
  });
  document.querySelector("#socialPostFilters")?.addEventListener("change", (event) => {
    const select = event.target.closest("#socialPostFilterSelect");
    if (!select) return;
    activeSocialPostFilter = select.value;
    renderSocialPosts();
  });

  document.querySelector("#socialPostTrackerList")?.addEventListener("change", (event) => {
    const check = event.target.closest("input[data-social-check]");
    if (check) {
      updateSocialPost(check.dataset.id, { [check.dataset.socialCheck]: check.checked ? "YES" : "NO" });
      return;
    }

    const workflowSelect = event.target.closest("select[data-social-workflow-select]");
    if (workflowSelect) {
      const statusWorkflow = workflowSelect.value;
      const patch = { statusWorkflow };
      if (statusWorkflow === "Duplicate or Cancelled") patch.duplicateValidation = "Marked duplicate or cancelled manually";
      updateSocialPost(workflowSelect.dataset.socialWorkflowSelect, patch);
      showToast(`Workflow moved to ${statusWorkflow}.`);
      return;
    }

    const photoInput = event.target.closest("input[data-listing-photo]");
    if (photoInput && photoInput.files.length) {
      processListingPhoto(photoInput.dataset.id, photoInput.dataset.listingPhoto, photoInput.files[0]).catch(() => showToast("Photo prep failed."));
    }
  });
  document.querySelector("#socialPostSearch")?.addEventListener("input", (event) => {
    socialPostSearchTerm = event.target.value;
    renderSocialPosts();
  });

  document.querySelector("#socialPostTrackerList")?.addEventListener("click", (event) => {
    const workflowButton = event.target.closest("button[data-social-workflow]");
    if (workflowButton) {
      const statusWorkflow = workflowButton.dataset.socialWorkflow;
      const patch = { statusWorkflow };
      if (statusWorkflow === "Duplicate or Cancelled") patch.duplicateValidation = "Marked duplicate or cancelled manually";
      updateSocialPost(workflowButton.dataset.id, patch);
      showToast(`Workflow moved to ${statusWorkflow}.`);
      return;
    }

    const actionRunButton = event.target.closest("button[data-social-action-run]");
    if (actionRunButton) {
      const id = actionRunButton.dataset.socialActionRun;
      const select = document.querySelector(`select[data-social-action-select="${CSS.escape(id)}"]`);
      if (!select?.value) return;
      handleSocialPostAction(select.value, getSocialPostById(id));
      return;
    }

    const actionButton = event.target.closest("button[data-social-action]");
    if (!actionButton) return;
    handleSocialPostAction(actionButton.dataset.socialAction, getSocialPostById(actionButton.dataset.id));
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
  document.querySelector("#generateCaptionWithChatGptBtn")?.addEventListener("click", () => {
    showToast("Generating caption...");
    generateCaptionFromBuilder().catch((error) => {
      setSocialPostSyncStatus(`Caption server error: ${error.message}`);
      showToast("Caption server is not running or OpenAI is not configured.");
    });
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

  document.querySelector("#sidebarToggle")?.addEventListener("click", () => {
    const sidebar = document.querySelector("#sidebarNav");
    const isOpen = sidebar?.classList.toggle("open");
    document.querySelector("#sidebarToggle").setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.tab}`)?.classList.add("active");
      updateHeaderPageTitle(tab.childNodes[0]?.textContent.trim() || "Dashboard");
      document.querySelector("#sidebarNav")?.classList.remove("open");
      document.querySelector("#sidebarToggle")?.setAttribute("aria-expanded", "false");
    });
  });
});
