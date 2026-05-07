const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.CAPTION_PORT || 8791);
const apiKey = process.env.OPENAI_API_KEY || "";
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

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
    .replace(/[\u2014\u2013-]/g, ",")
    .replace(/#[^\s#]+/g, (tag, offset, full) => {
      const tags = full.slice(0, offset).match(/#[^\s#]+/g) || [];
      return tags.length < 5 ? tag : "";
    })
    .trim();
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
  if (!apiKey) return { caption: localFallback(body), fallback: true };
  const prompt = `Create an Instagram real estate caption using these rules:\n- Status in ALL CAPS\n- Full property address on first line\n- No hyphens or em dashes\n- Max 5 hashtags\n- Always include #arizona #RealEstate #TheJakobovGroup\n- Use only the agent Instagram handle and @thejakobovgroup in the Exclusively listed by line\n- Polished modern Arizona luxury real estate tone\n\nListing data:\n${JSON.stringify(body, null, 2)}`;
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
  return { caption: cleanCaption(text), fallback: false };
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return json(res, 200, { ok: true });
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname === "/status") return json(res, 200, { ok: true, configured: Boolean(apiKey), model });
    if (url.pathname === "/generate-caption" && req.method === "POST") {
      const body = await readBody(req);
      const result = await generateCaption(body);
      return json(res, 200, { ok: true, ...result });
    }
    json(res, 404, { ok: false, error: "Not found" });
  } catch (error) {
    json(res, 500, { ok: false, error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`VA Command Center caption server running at http://127.0.0.1:${port}`);
});