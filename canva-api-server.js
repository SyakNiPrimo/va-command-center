const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rootDir = __dirname;
const port = Number(process.env.PORT || 8787);
const tokenPath = path.join(rootDir, "canva-token.json");
const verifierPath = path.join(rootDir, "canva-oauth-state.json");
const exportDir = path.join(rootDir, "exports");

const clientId = process.env.CANVA_CLIENT_ID || "";
const clientSecret = process.env.CANVA_CLIENT_SECRET || "";
const redirectUri = process.env.CANVA_REDIRECT_URI || `http://127.0.0.1:${port}/oauth/callback`;
const scopes = [
  "design:content:read",
  "design:content:write",
  "asset:read",
  "asset:write",
  "design:meta:read",
  "brandtemplate:meta:read",
  "brandtemplate:content:read",
  "profile:read"
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4"
};

function json(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(data, null, 2));
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function base64Url(buffer) {
  return Buffer.from(buffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function requireConfig(res) {
  if (clientId && clientSecret) return true;
  json(res, 400, {
    ok: false,
    error: "Missing CANVA_CLIENT_ID or CANVA_CLIENT_SECRET. Add them to run-canva-server.ps1 first."
  });
  return false;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

async function exchangeToken(params) {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://api.canva.com/rest/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(params)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  data.saved_at = Date.now();
  writeJson(tokenPath, data);
  return data;
}

async function getAccessToken() {
  const token = readJson(tokenPath);
  if (!token) throw new Error("Canva is not connected yet.");

  const expiresAt = token.saved_at + (token.expires_in || 0) * 1000;
  if (Date.now() < expiresAt - 60000) return token.access_token;

  if (!token.refresh_token) throw new Error("Missing Canva refresh token. Connect Canva again.");
  const refreshed = await exchangeToken({
    grant_type: "refresh_token",
    refresh_token: token.refresh_token
  });
  return refreshed.access_token;
}

function createCanvaAuthorizationUrl() {
  const codeVerifier = base64Url(crypto.randomBytes(64));
  const codeChallenge = base64Url(crypto.createHash("sha256").update(codeVerifier).digest());
  writeJson(verifierPath, { codeVerifier, state: "", createdAt: Date.now() });

  const authUrl = new URL("https://www.canva.com/api/oauth/authorize");
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "s256");
  authUrl.searchParams.set("scope", scopes.join(" "));
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);

  return authUrl.toString().replace(/\+/g, "%20");
}

async function canvaFetch(url, options = {}) {
  const accessToken = await getAccessToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function startExport(designId, pages) {
  return canvaFetch("https://api.canva.com/rest/v1/exports", {
    method: "POST",
    body: JSON.stringify({
      design_id: designId,
      format: {
        type: "mp4",
        quality: "vertical_1080p",
        ...(Array.isArray(pages) && pages.length ? { pages } : {})
      }
    })
  });
}

async function getExportJob(exportId) {
  return canvaFetch(`https://api.canva.com/rest/v1/exports/${encodeURIComponent(exportId)}`, {
    method: "GET"
  });
}

async function downloadFile(url, fileName) {
  fs.mkdirSync(exportDir, { recursive: true });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const filePath = path.join(exportDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://localhost:${port}`);
  const cleanPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const requestedPath = path.normalize(path.join(rootDir, cleanPath));

  if (!requestedPath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(requestedPath) || fs.statSync(requestedPath).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const ext = path.extname(requestedPath).toLowerCase();
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  fs.createReadStream(requestedPath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      json(res, 200, { ok: true });
      return;
    }

    const url = new URL(req.url, `http://localhost:${port}`);

    if (url.pathname === "/api/canva/status") {
      json(res, 200, {
        ok: true,
        configured: Boolean(clientId && clientSecret),
        connected: Boolean(readJson(tokenPath)),
        clientId,
        redirectUri,
        scopes
      });
      return;
    }

    if (url.pathname === "/api/canva/login-url") {
      if (!requireConfig(res)) return;
      json(res, 200, {
        ok: true,
        url: createCanvaAuthorizationUrl()
      });
      return;
    }

    if (url.pathname === "/canva/login") {
      if (!requireConfig(res)) return;
      res.writeHead(302, { Location: createCanvaAuthorizationUrl() });
      res.end();
      return;
    }

    if (url.pathname === "/oauth/callback") {
      if (!requireConfig(res)) return;
      const saved = readJson(verifierPath);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (!saved || !code || (saved.state && state !== saved.state)) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Canva connection failed</h1><p>State or code was missing. Try connecting again.</p>");
        return;
      }

      await exchangeToken({
        grant_type: "authorization_code",
        code,
        code_verifier: saved.codeVerifier,
        redirect_uri: redirectUri
      });

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Canva connected</h1><p>You can close this tab and return to VA Command Center.</p>");
      return;
    }

    if (url.pathname === "/api/canva/export" && req.method === "POST") {
      const body = await readBody(req);
      const designId = body.designId || "DAHI50PL_aY";
      const pages = body.pages;
      const title = String(body.title || "social-media-video").replace(/[^a-z0-9-_]+/gi, "-");

      const created = await startExport(designId, pages);
      const exportId = created.job.id;
      let job = created.job;

      for (let attempt = 0; attempt < 30 && job.status === "in_progress"; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const result = await getExportJob(exportId);
        job = result.job;
      }

      if (job.status !== "success" || !job.urls || !job.urls.length) {
        json(res, 500, { ok: false, job });
        return;
      }

      const filePath = await downloadFile(job.urls[0], `${title}.mp4`);
      json(res, 200, { ok: true, exportId, filePath, downloadUrl: job.urls[0] });
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    json(res, 500, { ok: false, error: error.message });
  }
});

server.listen(port, () => {
  console.log(`VA Command Center running at http://localhost:${port}`);
  console.log(`Canva redirect URI: ${redirectUri}`);
});
