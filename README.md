# The Jakobov Group VA Command Center

This is a simple local dashboard for daily Virtual Assistant work with Ari and The Jakobov Group.

## App Structure

- `index.html` contains the dashboard layout.
- `styles.css` controls the clean responsive interface.
- `app.js` contains the task data model, reminder logic, local storage, templates, caption builder, and checklist behavior.
- `vercel.json` makes the GitHub repo deploy cleanly as a static Vercel app.
- `.vercelignore` keeps local env files, logs, token files, and generated assets out of Vercel uploads.
- The Settings tab contains integration helpers, Gmail snapshot items, calendar snapshot items, and branding settings.
- The app uses a left side navigation menu on desktop with Home, Listings, Trivia, Payments, Tasks, Attendance, Compliance, Reports, Templates, and Settings. On smaller screens, the menu collapses behind a Menu button.

## Vercel Deployment

Use GitHub as the repo source so Vercel deploys automatically from `main`.

1. Open Vercel.
2. Click **Add New > Project**.
3. Import the GitHub repo: `SyakNiPrimo/va-command-center`.
4. Framework preset: **Other**.
5. Build command: leave blank.
6. Output directory: leave blank.
7. Install command: leave blank.
8. Click **Deploy**.

After this, every push to `main` will redeploy the VA Command Center.

Important notes:

- The app is currently a static frontend on Vercel.
- Google Sheets, Gmail, attendance, and brochure sending still use the existing Google Apps Script URLs.
- Supabase Auth and Supabase Edge Functions continue to work from Vercel.
- Local env files like `caption_local.env` and `canva-local.env` are excluded from deployment.
- Future upgrade: add Vercel serverless routes for secure PDF generation, OpenAI calls, Canva workflows, and email actions.

## Branding Assets

The app uses local branding assets so it works on Vercel, GitHub Pages, and locally without external image links.

- Sidebar logo: `assets/branding/jakobov-white.svg`
- Light background logo: `assets/branding/jakobov-dark.svg`
- Luxury listing logo: `assets/branding/exp-luxury.svg`
- Regular listing logo: `assets/branding/exp-realty.svg`
- Blank fallback asset: `assets/branding/blank.svg`

The sidebar uses the white Jakobov logo on a dark branded background. The Home dashboard uses the dark Jakobov logo on light content areas. The Settings page includes a Branding section that lists the current brand name, logo paths, colors, and branding mode.

Listing branding is automatic:

- Price of `$1,000,000` or more shows Luxury branding and the Luxury logo.
- Price below `$1,000,000` shows eXp Realty branding and the eXp Realty logo.

To replace the assets later, keep the same filenames in `assets/branding`, or update the `brandConfig` object in `app.js`. If a logo file is missing, the app shows a text fallback instead of breaking the listing card.

## Recommended Storage

The current version uses browser `localStorage` so it works by opening the file directly. This keeps it simple and practical.

Supabase is also configured as an optional cloud backup layer:

- Project URL: `https://tmheeonnhqetjwslmyjf.supabase.co`
- Table: `va_command_center_state`
- Record ID: `ben-va-command-center`
- Setup SQL: `supabase-schema.sql`

To enable Supabase backup:

1. Open Supabase.
2. Go to **SQL Editor**.
3. Paste and run `supabase-schema.sql`.
4. Open VA Command Center.
5. Go to **Settings / Integrations**.
6. Click **Check Supabase**.
7. Click **Push Backup** to save the current browser dashboard state.
8. Use **Pull Backup** only when you want to replace this browser's local dashboard state with the Supabase backup.

The app still works locally if Supabase is not set up or offline.

The Supabase backup includes login metadata such as login enabled, current username, last login time, last logout time, auth provider, Supabase user ID, and session type. It does **not** store the local password. Real email and password authentication is handled by Supabase Auth.

Security note: the Supabase anon public key is allowed in frontend code, but broad anon write policies are not production security. Before storing sensitive data on public hosting, upgrade to Supabase Auth and user-specific Row Level Security policies.

Later upgrade paths:

- Google Sheets for shared task tracking.
- Airtable or Notion for a database style workflow.
- Supabase Auth for secure multi device login and sync.

## Supabase Authentication

The dashboard now opens to a login screen before showing the app. The primary login path is Supabase Auth using email and password.

To create the VA login:

1. Open Supabase.
2. Go to **Authentication**.
3. Open **Users**.
4. Click **Add user**.
5. Add the email and password you want to use for the dashboard.
6. Leave **Auto Confirm User** enabled if Supabase asks.
7. Open the VA Command Center and log in with that email and password.

The login session uses:

- `sessionStorage` when **Remember me** is unchecked.
- `localStorage` when **Remember me** is checked.

Logout clears the local dashboard session and also calls the Supabase logout endpoint when the user logged in through Supabase Auth.

The old local login remains as a fallback while setup is in progress. Default local fallback credentials are stored in `app.js`:

- Username: `ben`
- Password: `change-this-password`

To disable the fallback later, change `allowLocalFallback` to `false` in the `authConfig` object in `app.js`.

## Google Sync Notes

The Settings tab has a Google sync snapshot with:

- Gmail inbox counts and selected actionable inbox items.
- Upcoming calendar events.
- Buttons to turn synced Gmail items into dashboard tasks.

This is a snapshot generated through Codex. The local browser app does not continuously connect to Gmail, Calendar, or Drive on its own.

## Canva Video Workflow

The Social Media tab includes a Canva Short Video Workflow for listing videos.

Use it to track:

- Property address.
- Canva design link.
- Exported MP4 file name.
- Video status from Needs Canva Video to Posted.

The workflow is connected to the owned Canva design **Social Media Video**:

- Design ID: `DAHI50PL_aY`.
- Edit link: `https://www.canva.com/d/FMNZvq0Nvc1lR44`.
- Size: 1080 x 1350.
- Pages: 15 listing video layouts.

The first sample video task is for `42610 N 22ND ST.mp4`.

For deeper Canva automation, share a reusable Canva template or design link. Codex can help prepare the workflow and update tracked video tasks, but final MP4 exporting may still need Canva access and manual confirmation depending on what Canva allows from the connected tools.

## Canva API Setup

The project now includes a local Canva API server:

- `canva-api-server.js`
- `run-canva-server.ps1`

Canva uses OAuth 2.0 with PKCE. The client secret must stay in the local server, not in `index.html`.

Setup steps:

1. Go to `https://www.canva.com/developers`.
2. Create a Canva Connect API integration.
3. Add this redirect URL: `http://127.0.0.1:8787/oauth/callback`.
4. Add scopes for design export and assets:
   - `design:meta:read`
   - `design:content:read`
   - `design:content:write`
   - `asset:read`
   - `asset:write`
   - `brandtemplate:meta:read`
   - `brandtemplate:content:read`
   - `profile:read`
5. Copy the Canva Client ID and Client Secret.
6. Copy `canva-local.env.example` to `canva-local.env`.
7. Paste the Canva Client ID and Client Secret into `canva-local.env`.
8. Run:

```powershell
.\run-canva-server.ps1
```

Or double click:

```text
start-canva-api-server.cmd
```

Keep the PowerShell or Command Prompt window open while using Canva API features.

9. Open `http://127.0.0.1:8787`.
10. Go to Social > Canva API Setup.
11. Click Check Canva API, then Connect Canva.

After Canva is connected, the Export MP4 button starts an MP4 export for the Social Media Video template and saves it into the local `exports` folder.

## Instagram Photo Prep

The Social Media tab also includes Instagram Photo Prep for six listing photos:

- Living Room.
- Kitchen.
- Dining.
- Bedroom.
- Bathroom.
- Exterior Yard.

Upload each photo, then generate a 1080 x 1350 JPG with the same image blurred in the background and the sharp property photo centered in front. This runs in the browser, so the photos stay on the computer.

Photo prep is local canvas processing only. It does not use OpenAI image generation because property details should not be altered. The main property photo is scaled to fit inside the Instagram frame without cropping important details, then exported as a separate JPG download for each slot.

### Virtual Twilight GPT

The Photo Prep area includes a manual link to the custom **Real Estate Virtual Twilight Editor** GPT:

`https://chatgpt.com/g/g-6a02531e93548191a244d8c4e3a69718-real-estate-virtual-twilight-editor`

Use it only for virtual twilight exterior marketing images. The app copies a prompt that tells the GPT to keep the property architecture accurate, avoid changing real home details, and create a realistic twilight look. Listing rows also include quick actions to open this GPT or copy the twilight prompt with listing context.

The app also includes an in-app **Virtual Twilight Generator**. This uses a Supabase Edge Function so the OpenAI API key stays out of the frontend.

Supabase function:

- `supabase/functions/generate-twilight-image/index.ts`

Deploy it with:

```powershell
supabase functions deploy generate-twilight-image
```

Required Supabase secret:

```powershell
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

Optional image model override:

```powershell
supabase secrets set OPENAI_IMAGE_MODEL=gpt-image-1.5
```

The generator is for exterior virtual twilight edits only. Always review the result before using it in marketing.

## Attendance Tracking

The Attendance tab tracks morning Zoom and Office attendance in a spreadsheet-style table with checkboxes per agent per selected date.

Fields:

- Attendance session date in Arizona time.
- Meeting type.
- Meeting time.
- Agent roster. The roster starts minimized by default so the attendance table stays easy to scan.
- Agent roster contact fields: Agent Name, IG Handle, Email Address, Phone Number, and Status.
- Zoom checkbox: checked means the agent was in the Zoom meeting.
- Office checkbox: checked means the agent attended in office.
- Optional agent notes.

Google Sheet link:

`https://docs.google.com/spreadsheets/d/1nmdNyzfdG7V3guU7BmghtTaujAun7TDkRyK5WefTJ04/edit?usp=sharing`

The dashboard can update the spreadsheet after the Apps Script sync URL is added to `attendanceSyncUrl` in `app.js`.

The same Apps Script can also read the `Agent Roster` tab. After redeploying `attendance-sync-apps-script.js`, click **Sync Agent Roster** in the Attendance page to merge rows from the Task Tracker `Agent Roster` sheet into the app roster. Matching agents are updated by name and new agents are added without deleting local attendance history.

Expected `Agent Roster` columns:

- Name
- IG Handle
- Email Address
- Phone Number
- Status

The default in-app roster is also prefilled from the current Task Tracker `Agent Roster` tab, so new browser sessions start with agent IG handles, emails, phone numbers, and active status already available.

Current detected Task Tracker attendance layout:

- Agent rows.
- Paired date columns.
- Each date has a Zoom checkbox column and an Office checkbox column.
- The dashboard tracks both Zoom and Office checkboxes.

## Attendance Sheet Sync

The dashboard includes a **Sync To Task Tracker** button. To make it write directly to Google Sheets:

1. Open Task Tracker.
2. Go to Extensions > Apps Script.
3. Paste the code from `attendance-sync-apps-script.js`.
4. Deploy it as a Web app.
5. Set access to anyone with the link or your Workspace users.
6. Copy the Web app URL.
7. Paste it into `app.js` as the `attendanceSyncUrl` value.

Until the URL is added, the sync button copies the attendance payload so nothing gets lost.

## Data Model

```js
{
  tasks: [
    {
      id: "unique id",
      title: "Task name",
      category: "Email Tasks",
      status: "Pending",
      priority: "High",
      due: "2026-05-05",
      notes: "Next step or approval needed"
    }
  ],
  compliance: [],
  dailyState: {
    date: "YYYY-MM-DD",
    meetingSent: false
  }
}
```

## Reminder Logic

- If today is Tuesday, the dashboard shows the Bowers Weekly Zoom template.
- Every other day, it shows the Daily Team Meeting and Roleplay template.
- The meeting reminder can be copied with one button.
- The reminder can be marked sent for the day.
- At 8:15 AM Arizona time, the WhatsApp reminder card highlights for Daily Team Meeting and Roleplay while the dashboard is open.
- At 7:45 AM Arizona time, the WhatsApp reminder card highlights for Tuesday Bowers Weekly Zoom while the dashboard is open.
- The dashboard checks the day and reminder time using Arizona time, even if the computer is in another timezone.
- The WhatsApp reminder uses the same Tuesday versus non Tuesday message logic.
- The WhatsApp message can be copied manually and marked sent.
- Weekly Ari workflows use Arizona time through the same `America/Phoenix` date logic.
- Friday Arizona time shows the Weekly Payment Request in Daily Focus.
- Wednesday Arizona time shows the Weekly Arizona Trivia Post in Daily Focus and the Social tab.

## Daily Workflow

1. Open the dashboard.
2. Copy and send the meeting reminder.
3. Paste the morning Zoom link into Read.ai: `https://us06web.zoom.us/j/7251527919`.
4. If it is Friday Arizona time, generate/copy the Weekly Payment Request and send it to Ari.
5. If it is Wednesday Arizona time, review the Weekly Arizona Trivia Post and prepare the carousel.
6. Click **Sync Listing Emails** in the Social tab.
7. Click **Sync Social Posts**.
8. Verify each listing agent, headshot, logo type, phone, email, and Instagram handle.
9. Create the Canva design and paste the Canva video or graphics link.
10. Upload or select the six MLS photos and generate photo prep.
11. Generate the caption.
12. Prepare the WhatsApp handoff package.
13. Post manually from the phone and add music.
14. Paste the IG post link and click **Mark Posted**.
15. Open the EOD Report tab, regenerate the report, and copy it for Ari.

## Build Instructions

No install is required.

Open this file in a browser:

`C:\Users\Benedick\Documents\VA Command Center\index.html`

Recommended local server:

```powershell
node local-static-server.js
```

Then open:

`http://127.0.0.1:5500/`

## Code Implementation Plan For Future Versions

1. Add export to CSV for task reports.
2. Add browser notifications for the dynamic 15 minute meeting reminder.
3. Add a weekly report generator.
4. Add Google Sheets sync for shared visibility.
5. Add calendar based reminders for weekly compliance checks.

## Luxury Brochure Request Email Sending

The dashboard has a main-page **Luxury Brochure Request** button that opens a guided popup:

1. Enter agent name, address, MLS number, and MLS link.
2. Review the completed email.
3. Use Edit Details if anything needs correction.
4. Click Confirm And Send.

Kim's default email is `KLeal@navititle.com`.

For true one-click sending from GitHub Pages, deploy `brochure-email-apps-script.js` as a Google Apps Script web app and paste the web app URL into `brochureEmailSendUrl` in `app.js`. Until that URL is connected, Confirm And Send opens a prefilled Gmail draft and adds a waiting task for Kim's brochure reply.
## Listing Social Media Automation

The Social tab now supports the listing workflow from MLS email intake through manual Instagram posting.

Workflow:

1. Gmail listing status email is labeled `Listing Updates`.
2. `gmail-listing-sync-apps-script.js` parses the email and adds a row to `Social Post Tasks`.
3. The app syncs active rows with **Sync Social Posts**.
4. Each listing card tracks price, logo type, agent confirmations, Canva video, 6 prepared photos, caption, WhatsApp handoff, and final IG link.
5. Posting stays manual on the phone so music and compliance can be reviewed before publishing.
6. Paste the IG link and click **Mark Posted** to complete the task.

Google Apps Script files:

- `social-posts-sync-apps-script.js` reads and updates the `Social Post Tasks` sheet tab.
- `gmail-listing-sync-apps-script.js` scans Gmail label `Listing Updates`, avoids duplicates, and creates new listing tasks.

### Social Posts Google Sheets Sync Setup

1. Open the Task Tracker sheet.
2. Go to Extensions > Apps Script.
3. Paste `social-posts-sync-apps-script.js`.
4. Deploy > New deployment > Web app.
5. Set **Execute as** to `Me`.
6. Set access to `Anyone with the link` or your Workspace users.
7. Copy the Web app URL.
8. Paste it into `app.js` as `socialPostsSyncUrl`.

The script safely creates missing `Social Post Tasks` columns, supports `includeCompleted=true`, and updates rows by `ID`.

Required columns include:

`ID`, `Date Received`, `Agent Name`, `Listing Type`, `MLS#`, `MLS Link`, `Property Address`, `Price`, `Bedrooms`, `Bathrooms`, `Approximate Square Feet`, `MLS Description`, `Duplicate Validation`, `Status (Workflow)`, `Logo Type`, `Agent Headshot Link`, `Agent Headshot File`, `Agent Headshot Found`, `Agent Headshot Confirmed`, `Agent Name Confirmed`, `Agent Phone Confirmed`, `Agent Email Confirmed`, `Agent Instagram Handle`, `Agent Instagram Handle Confirmed`, `Subject`, `Email Template`, `Canva Video Link`, `Graphics Created?`, `Posted`, `Date Posted`, `Graphics Link`, `Caption`, `IG Post Link`, `Source Email ID`, `Source Email Subject`, `Source Email Date`, `Date Processed`.

### Gmail Listing Updates Sync Setup

1. In Gmail, create these labels:
   - `Listing Updates`
   - `Processed Listing Updates`
   - `Needs Review Listing Updates`
2. New Flexmls emails from `listingupdates@flexmail.flexmls.com` are automatically labeled as `Listing Updates` by the sync script before processing.
3. You can still manually add `Listing Updates` to any email you want the script to process.
4. Open the Task Tracker sheet.
5. Go to Extensions > Apps Script.
6. Paste `gmail-listing-sync-apps-script.js`.
7. Save the project.
8. In the function dropdown, select `authorizeListingEmailSync`.
9. Click **Run**.
10. Approve Gmail and Google Sheets permissions for `ben@jakobovgroup.com`.
11. Deploy > New deployment > Web app.
12. Set **Execute as** to `Me`.
13. Set access to `Anyone with the link` or your Workspace users.
14. Copy the Web app URL.
15. Paste it into `app.js` as `gmailListingSyncUrl`.

If the app says Gmail sync failed and the Apps Script response mentions permissions, run `authorizeListingEmailSync` manually, then redeploy a new Web App version.

Test without changing Gmail or Sheets:

```text
WEB_APP_URL?dryRun=true
```

The Social tab also has **Test Email Sync**, which calls the same dry run mode.

Caption server setup:

1. Copy `caption_local.env.example` to `caption_local.env`.
2. Add `OPENAI_API_KEY` to `caption_local.env`.
3. Run `run_caption_server.ps1` or double click `start_caption_api_server.cmd`.
4. Keep the server window open while using **Generate Caption** in the Social tab.

The OpenAI API key is never stored in frontend files.

Custom Listing GPT:

The Social tab also links to the custom **Listing Caption GPT**:

`https://chatgpt.com/g/g-6a0213727ae8819182e88a879a7cfd84-listing-caption-gpt`

Use it when you want ChatGPT's full GPT interface for:

- Listing caption drafts.
- Instagram photo prep instructions.
- Reviewing the six listing photo slots before final posting.

Each listing row has quick actions:

- **Open Listing GPT** copies a listing-specific prompt and opens the GPT.
- **Copy GPT Prompt** copies the same prompt without opening a new tab.

The reusable GPT Builder instruction file is:

- `listing-caption-gpt-instructions.md`

Paste that file into the custom GPT instructions if you want the GPT itself to permanently follow the VA Command Center listing workflow.

This is a manual handoff. The app does not expose API keys and does not post to Instagram.

GitHub Pages ChatGPT setup:

GitHub Pages cannot safely store the OpenAI API key, so the published app calls Supabase Edge Functions instead of the local caption server.

Supabase functions included:

- `supabase/functions/generate-caption/index.ts`
- `supabase/functions/generate-trivia/index.ts`
- `supabase/functions/generate-twilight-image/index.ts`

Deploy steps:

1. Install and log in to the Supabase CLI.
2. Link this project to Supabase project `tmheeonnhqetjwslmyjf`.
3. Set the secret:

```powershell
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

4. Deploy the functions:

```powershell
supabase functions deploy generate-caption
supabase functions deploy generate-trivia
supabase functions deploy generate-twilight-image
```

When the app runs on GitHub Pages, it calls:

- `https://tmheeonnhqetjwslmyjf.supabase.co/functions/v1/generate-caption`
- `https://tmheeonnhqetjwslmyjf.supabase.co/functions/v1/generate-trivia`
- `https://tmheeonnhqetjwslmyjf.supabase.co/functions/v1/generate-twilight-image`

When the app runs locally on `localhost` or `127.0.0.1`, it still uses the local caption server at `http://127.0.0.1:8791`.

### Testing With Sample Data

Use the Social tab buttons:

- **Load Sample Social Posts** adds local sample listing tasks for Coming Soon, New Listing, Active, Pending, Under Contract, Closed, Canceled, Missing MLS, Missing Agent Handle, and Duplicate.
- **Clear Samples** removes only sample rows and keeps real or synced rows.

Sample data is local only. It does not overwrite Google Sheets data unless you manually copy and use an update payload.

## Weekly Payment Request Workflow

The dashboard includes a **Weekly Payment Request** card for Ari.

- Schedule: every Friday morning Arizona time.
- Daily Focus: appears on Fridays if the current Friday request has not been marked sent.
- Storage: localStorage, keyed by the Friday Arizona date, so it resets the next Friday.
- Defaults:
  - Total Hours: `40`
  - Rate Per Hour: `$5`
  - Total Amount: auto calculated as hours times rate.

Use it:

1. Review Start Date and End Date.
2. Confirm Total Hours and Rate Per Hour.
3. Click **Generate Payment Request**.
4. Click **Copy Payment Request**.
5. Send the message to Ari.
6. Click **Mark Sent**.

To test before Friday, temporarily change your computer date to a Friday, open the dashboard, then change it back after confirming the card says `Due Today`.

## Monthly Payslip Generator

The Payments page includes a **Payslip Generator** for completed months only.

- Scope: one payslip per month.
- Rule: only previous months can be generated. Current and future months are rejected.
- Storage: localStorage, keyed by month.
- Defaults:
  - Total Hours: `160`
  - Rate Per Hour: `$5`
  - Total Amount: auto calculated as hours times rate.

Use it:

1. Open Payments.
2. Select a previous month.
3. Review Total Hours, Rate Per Hour, Status, and Work Summary.
4. Click **Generate Payslip**.
5. Click **Download PDF**, **Copy Payslip**, or **Mark Sent**.

PDF behavior:

- The app loads `jsPDF` from a CDN and downloads a branded one page PDF.
- If the PDF library is blocked, the app opens a printable payslip view so you can use the browser's **Save as PDF** option.

Vercel note: the app can be hosted on Vercel as a static app now. Vercel is also a good future home for secure serverless routes for PDF generation, OpenAI calls, Canva workflows, and email actions.

## Weekly Arizona Trivia Post Workflow

The Social tab includes **Weekly Arizona Trivia Post** for The Jakobov Group.

- Schedule: every Wednesday morning Arizona time.
- Daily Focus: appears on Wednesdays if the weekly post is not Posted or Completed.
- Format: 2 slide carousel.
- Storage: localStorage, keyed by Arizona week, so refreshing does not create duplicates.
- Local generator: always works even if the caption server is off.
- OpenAI caption server: if running, the dashboard asks it to improve the trivia copy and caption.

Fields:

- Trivia Topic
- Slide 1 Text
- Slide 2 Text
- Caption
- Hashtags
- Background Image 1
- Background Image 2
- Status
- Date Created
- Date Posted

Status options:

- Idea
- Drafting
- Designing
- Ready To Post
- Posted
- Completed

Use it:

1. Click **Generate Trivia Post**.
2. Review Slide 1 and Slide 2.
3. Choose images.
4. Create the carousel design.
5. Copy the caption.
6. Post manually.
7. Click **Mark Posted**.

If the caption server is not running, the Social tab shows: `Using local trivia generator. Start caption server for stronger copy.`

To test before Wednesday, temporarily change your computer date to a Wednesday, open the dashboard, and confirm Daily Focus shows the weekly trivia reminder. You can also click **Generate Trivia Post** any day to test the local generator.
## Agent Headshots Source

Official Google Drive folder:

`https://drive.google.com/drive/folders/1upm9VVosOnJTwSaa36HWhnfeVxWy5XBB?usp=sharing`

The app stores this as `agentHeadshotsFolderUrl` and uses the known file list to suggest headshots from the agent name. Examples:

- Steele Nash -> `Steele.jpeg`
- Ari Jakobov -> `Ari1.jpeg`, `Ari2.jpeg`, or `Ari3.jpeg`
- Stephanie Pieper -> `Steph.jpeg`
- Katherine -> `Kath.jpeg` or `Kath2.jpeg`
- James -> `James.jpeg` or `James2.jpeg`
- Catherine -> `Catherine.jpeg` or `Catherine2.jpeg`
- Samuel -> `Sam.jpeg`
- Josef or Josef Babadzhanov -> `Joe.jpeg`

Each Social listing card shows the suggested headshot, allows manual override, and saves the selected headshot file/link for Canva video design work. If no match is found, the card warns: `Agent headshot missing. Select manually before finalizing design.`
