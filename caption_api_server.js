const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.CAPTION_PORT || 8791);
const apiKey = process.env.OPENAI_API_KEY || "";
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function json(res, status, data) {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(data, null, 2));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function cleanCaption(text) {
  return String(text || "")
    .replace(/[\u2014\u2013]/g, ",")
    .replace(/-/g, " ")
    .replace(/#[^\s#]+/g, (tag, offset, full) => {
      const tags = full.slice(0, offset).match(/#[^\s#]+/g) || [];
      return tags.length < 5 ? tag : "";
    })
    .trim();
}

function extractSection(text, heading) {
  const pattern = new RegExp(`${heading}:\\s*([\\s\\S]*?)(?:\\n\\s*(?:Missing Data|Caption|Photo Prep|WhatsApp Handoff):|$)`, "i");
  return String(text || "").match(pattern)?.[1]?.trim() || "";
}

function buildListingCaptionPrompt(body) {
  return `You are the automated Listing Caption GPT inside The Jakobov Group VA Command Center.

Role:
You help Ben prepare listing Instagram captions, photo prep guidance, and WhatsApp handoff copy for manual phone posting.

Workflow context:
- The listing task comes from MLS or Gmail listing update emails.
- Ben still reviews the caption before posting.
- Instagram posting stays manual.
- Do not invent missing property facts.
- Do not imply compliance approval.

Required data to review:
- Listing status
- Full property address
- Agent name
- Agent Instagram handle
- MLS number
- MLS link
- Price or sold price
- Bedrooms
- Bathrooms
- Approximate square feet
- MLS description
- Logo type
- Agent headshot status
- Canva video link or graphics link
- Six MLS photo slots

Caption style:
- Use a friendly premium Instagram listing style like:
  sparkle emoji, status title, city
  two polished paragraphs
  location pin line with full address
  bed, bath, square footage, and price lines with simple real estate emojis
  Listed by: agent Instagram handle
  hashtags
- The first line should be a status headline, for example "✨ New Listing in Phoenix" or "✨ Just Closed in Scottsdale".
- Mention the full property address in the property detail section, not as the first line.
- Use 2 short polished paragraphs that feel warm, clear, and easy to read.
- Include bed, bath, square footage, and price or sold price as separate detail lines when available.
- Use these detail label formats exactly when data is available: "🛏️ 2 Bedrooms", "🛁 2 Bathrooms", "📐 1,344 Sq Ft", "💲 $395,000".
- Include "Listed by:" with only the agent Instagram handle.
- Use no more than 5 hashtags.
- Always include #arizona #RealEstate #TheJakobovGroup.
- Add 1 to 2 relevant local/status hashtags when appropriate, such as #PhoenixAZ or #NewListing.
- Do not use hyphens.
- Do not use em dashes.
- Avoid the phrase "Exclusively listed by".
- Use a polished, modern, Arizona real estate tone that is clear, inviting, and not too formal.
- For closed listings, focus on the sold result and sold price if provided.
- For canceled listings, do not create a posting caption. Say this listing should not be posted.

Photo prep rules:
- Photo prep is normal image processing only, not generative editing.
- 1080 x 1350 JPG.
- Keep the main property photo sharp and unchanged.
- Add blurred background fill only.
- Do not alter house details.

Return exactly:
Missing Data:
- ...

Caption:
...

Photo Prep:
- Living Room:
- Kitchen:
- Dining:
- Bedroom:
- Bathroom:
- Exterior Yard or Best Feature:

WhatsApp Handoff:
...

Listing data:
${JSON.stringify(body, null, 2)}`;
}

function localFallback(body) {
  const status = String(body.status || body.listingType || "NEW LISTING").toUpperCase();
  const address = body.propertyAddress || "Property address needed";
  const agent = body.agentInstagramHandle || "@agenthandle";
  const details = [
    body.bedrooms ? `${body.bedrooms} bedrooms` : "bedrooms available in MLS",
    body.bathrooms ? `${body.bathrooms} bathrooms` : "bathrooms available in MLS",
    body.squareFeet ? `${body.squareFeet} approximate square feet` : "square footage available in MLS"
  ].join("\n");
  return `${address}\n${status}\n\n${body.description || "A polished Arizona listing with standout details and a strong market position."}\n\nFeature breakdown:\n${details}\n\nExclusively listed by ${agent} and @thejakobovgroup\n\n#arizona #RealEstate #TheJakobovGroup`;
}

async function generateCaption(body) {
  const prompt = buildListingCaptionPrompt(body);
  if (geminiApiKey) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent`, {
      method: "POST",
      headers: {
        "x-goog-api-key": geminiApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7
        }
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Gemini API error");
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
    const caption = extractSection(text, "Caption") || text;
    return {
      caption: cleanCaption(caption),
      missingData: extractSection(text, "Missing Data"),
      photoPrep: extractSection(text, "Photo Prep"),
      whatsappHandoff: extractSection(text, "WhatsApp Handoff"),
      fullOutput: text.trim(),
      provider: "gemini",
      fallback: false
    };
  }
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY or OPENAI_API_KEY is missing. Add a Gemini API key to caption_local.env or Supabase secrets, then restart or redeploy.");
  }
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: prompt,
      temperature: 0.7
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "OpenAI API error");
  const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("\n") || "";
  const caption = extractSection(text, "Caption") || text;
  return {
    caption: cleanCaption(caption),
    missingData: extractSection(text, "Missing Data"),
    photoPrep: extractSection(text, "Photo Prep"),
    whatsappHandoff: extractSection(text, "WhatsApp Handoff"),
    fullOutput: text.trim(),
    provider: "openai",
    fallback: false
  };
}

function parseTriviaOutput(text, fallback) {
  const cleaned = cleanCaption(text);
  const slide1 = cleaned.match(/Slide 1:\s*([\s\S]*?)(?:Slide 2:|Caption:|$)/i)?.[1]?.trim();
  const slide2 = cleaned.match(/Slide 2:\s*([\s\S]*?)(?:Caption:|$)/i)?.[1]?.trim();
  const caption = cleaned.match(/Caption:\s*([\s\S]*)/i)?.[1]?.trim();
  return {
    ...fallback,
    slide1Text: slide1 || fallback.slide1Text,
    slide2Text: slide2 || fallback.slide2Text,
    caption: caption || fallback.caption,
    hashtags: "#arizona #RealEstate #TheJakobovGroup",
    status: "Drafting"
  };
}

async function generateTrivia(body) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. The app can still use the local trivia generator.");
  }
  const prompt = `Create a weekly Arizona trivia social media carousel package for The Jakobov Group.

Rules:
- 2 slide carousel
- Slide 1 is a DID YOU KNOW style hook
- Slide 2 explains why this makes Arizona attractive to live in or move to
- Caption is polished, approachable, Arizona real estate friendly
- No hyphens or em dashes
- Max 5 hashtags
- Always include #arizona #RealEstate #TheJakobovGroup
- Do not mention automated tools

Return exactly:
Slide 1:
...

Slide 2:
...

Caption:
...

Current draft:
${JSON.stringify(body, null, 2)}`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: prompt,
      temperature: 0.7
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "OpenAI API error");
  const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("\n") || "";
  return parseTriviaOutput(text, body);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return json(res, 200, { ok: true });
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname === "/status" || url.pathname === "/health") {
      return json(res, 200, {
        ok: true,
        configured: Boolean(geminiApiKey || apiKey),
        provider: geminiApiKey ? "gemini" : apiKey ? "openai" : "missing",
        model: geminiApiKey ? geminiModel : model,
        message: geminiApiKey || apiKey ? "Caption server ready." : "GEMINI_API_KEY or OPENAI_API_KEY is missing. Add it to caption_local.env and restart."
      });
    }
    if (url.pathname === "/generate-caption" && req.method === "POST") {
      const body = await readBody(req);
      const result = await generateCaption(body);
      return json(res, 200, { ok: true, ...result });
    }
    if (url.pathname === "/generate-trivia" && req.method === "POST") {
      const body = await readBody(req);
      const post = await generateTrivia(body);
      return json(res, 200, { ok: true, post });
    }
    json(res, 404, { ok: false, error: "Not found" });
  } catch (error) {
    json(res, 500, { ok: false, error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`VA Command Center caption server running at http://127.0.0.1:${port}`);
});
