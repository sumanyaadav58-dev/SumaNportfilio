// Backend: serves the site and stores contact messages in data/messages.json
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const DIR = path.join(__dirname, "data");
const FILE = path.join(DIR, "messages.json");
const ADMIN_KEY = process.env.ADMIN_KEY || ""; // set this to read messages

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const hits = new Map(); // simple rate limit: 5 messages per 10 min per IP
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < 600000);
  list.push(now); hits.set(ip, list);
  return list.length > 5;
}
const read = () => { try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; } };

app.post("/api/contact", (req, res) => {
  if (limited(req.ip)) return res.status(429).json({ ok: false, error: "Too many messages. Try again later." });
  const { name, email, message } = req.body || {};
  if (!name || !/^\S+@\S+\.\S+$/.test(email || "") || !message || message.length > 3000)
    return res.status(400).json({ ok: false, error: "Please provide a name, a valid email and a message." });
  fs.mkdirSync(DIR, { recursive: true });
  const all = read();
  all.push({ id: Date.now(), name: String(name).slice(0, 100), email: String(email).slice(0, 150), message: String(message), at: new Date().toISOString() });
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2));
  res.json({ ok: true });
});

app.get("/api/messages", (req, res) => {
  if (!ADMIN_KEY || req.get("x-admin-key") !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  res.json(read());
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => console.log("Portfolio running on http://localhost:" + PORT));
