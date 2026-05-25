const calendar = require("../server/calendar");

const DEFAULT_ADMIN_KEY = "123456";

let ready = null;

function ensureReady() {
  if (!ready) ready = calendar.initGoogleCalendar();
  return ready;
}

function getBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return null;
  }
}

function checkAdminKey(req) {
  const expected = process.env.ADMIN_KEY || DEFAULT_ADMIN_KEY;

  const provided = req.query?.key || req.headers?.["x-admin-key"];
  if (provided !== expected) {
    return { ok: false, message: "Wrong password. Use the management password.", status: 401 };
  }
  return { ok: true };
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    const auth = checkAdminKey(req);
    if (!auth.ok) return res.status(auth.status || 401).json({ error: auth.message });

    try {
      await ensureReady();
      const bookings = await calendar.listBookings();
      return res.status(200).json({ bookings });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message || "Server error" });
    }
  }

  if (req.method === "DELETE") {
    const auth = checkAdminKey(req);
    if (!auth.ok) return res.status(auth.status || 401).json({ error: auth.message });

    try {
      await ensureReady();
      const deleted = await calendar.deleteBooking(req.query?.id);
      return res.status(200).json({ deleted });
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({ error: err.message || "Server error" });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await ensureReady();
    const body = getBody(req);
    if (!body) return res.status(400).json({ error: "Invalid JSON body" });

    const { date, start, name, email, notes, service } = body;
    if (!date || !start || !name || !email) {
      return res.status(400).json({ error: "date, start, name, and email are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "invalid email" });
    }

    const booking = await calendar.createBooking({
      date,
      start,
      name: name.trim(),
      email: email.trim(),
      notes,
      service,
    });
    return res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || "Server error" });
  }
};
