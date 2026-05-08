# Ari VA Daily Work Management Dashboard

This is a simple local dashboard for daily Virtual Assistant work with Ari and The Jakobov Group.

## App Structure

- `index.html` contains the dashboard layout.
- `styles.css` controls the clean responsive interface.
- `app.js` contains the task data model, reminder logic, local storage, templates, caption builder, and checklist behavior.
- The Google Sync tab contains a snapshot pulled through Codex Gmail, Calendar, and Drive connectors.

## Recommended Storage

The current version uses browser `localStorage` so it works by opening the file directly. This keeps it simple and practical.

Later upgrade paths:

- Google Sheets for shared task tracking.
- Airtable or Notion for a database style workflow.
- Firebase or Supabase for multi device sync.

## Google Sync Notes

The dashboard now has a Google Sync tab with:

- Gmail inbox counts and selected actionable inbox items.
- Upcoming calendar events.
- Recent Drive files.
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

## Attendance Tracking

The Attendance tab tracks morning Zoom and Office attendance in a spreadsheet-style table with checkboxes per agent per selected date.

Fields:

- Attendance session date in Arizona time.
- Meeting type.
- Meeting time.
- Agent roster.
- Zoom checkbox: checked means the agent was in the Zoom meeting.
- Office checkbox: checked means the agent attended in office.
- Optional agent notes.

Google Sheet link:

`https://docs.google.com/spreadsheets/d/1nmdNyzfdG7V3guU7BmghtTaujAun7TDkRyK5WefTJ04/edit?usp=sharing`

The dashboard can update the spreadsheet after the Apps Script sync URL is added to `attendanceSyncUrl` in `app.js`.

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

## Daily Workflow

1. Open `index.html`.
2. Copy and send the meeting reminder.
3. Paste the morning Zoom link into Read.ai: `https://us06web.zoom.us/j/7251527919`.
4. Review Top 3 Must Finish Tasks.
5. Add new social media, email, admin, attendance, and meeting tasks.
6. Move blocked work into the correct waiting status.
7. Mark completed tasks during the day.
8. Use the end of day template to report completed work and tomorrow priorities.
9. Open the EOD Report tab, regenerate the report, and copy it for Ari.

## Build Instructions

No install is required.

Open this file in a browser:

`C:\Users\Benedick\Documents\VA Command Center\index.html`

Optional local server:

```powershell
npx serve .
```

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

Caption server setup:

1. Copy `caption_local.env.example` to `caption_local.env`.
2. Add `OPENAI_API_KEY` to `caption_local.env`.
3. Run `run_caption_server.ps1` or double click `start_caption_api_server.cmd`.
4. Keep the server window open while using **Generate Caption** in the Social tab.

The OpenAI API key is never stored in frontend files.
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
