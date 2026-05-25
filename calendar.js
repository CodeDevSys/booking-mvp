const fs = require("fs");
const path = require("path");

const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const DEFAULT_SERVICE = "Cutting Hair";
const SLOT_MINUTES = Number(process.env.SLOT_MINUTES) || 30;
const BUSINESS_START = Number(process.env.BUSINESS_START) ?? 9;
const BUSINESS_END = Number(process.env.BUSINESS_END) ?? 17;

const bookings = [];

let calendarClient = null;
let calendarId = null;

function loadGoogleCredentials() {
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    try {
      return JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    } catch {
      console.warn("GOOGLE_CREDENTIALS_JSON is not valid JSON");
      return null;
    }
  }
  if (fs.existsSync(CREDENTIALS_PATH)) {
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  }
  return null;
}

async function initGoogleCalendar() {
  const id = process.env.GOOGLE_CALENDAR_ID;
  const credentials = loadGoogleCredentials();
  if (!id || !credentials) return false;

  try {
    let google;
    try {
      ({ google } = require("googleapis"));
    } catch {
      console.warn("googleapis not installed — use in-memory bookings or run: npm install googleapis");
      return false;
    }
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
    calendarClient = google.calendar({ version: "v3", auth });
    calendarId = id;
    return true;
  } catch (err) {
    console.warn("Google Calendar init failed, using in-memory store:", err.message);
    return false;
  }
}

function parseDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatSlotTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function generateDaySlots(dateStr) {
  const day = parseDate(dateStr);
  const slots = [];
  const start = new Date(day);
  start.setHours(BUSINESS_START, 0, 0, 0);
  const end = new Date(day);
  end.setHours(BUSINESS_END, 0, 0, 0);

  for (let t = new Date(start); t < end; t = new Date(t.getTime() + SLOT_MINUTES * 60000)) {
    slots.push({
      start: t.toISOString(),
      end: new Date(t.getTime() + SLOT_MINUTES * 60000).toISOString(),
      label: formatSlotTime(t),
    });
  }
  return slots;
}

function isSlotBooked(slotStart, bookedRanges) {
  const start = new Date(slotStart).getTime();
  const end = start + SLOT_MINUTES * 60000;
  return bookedRanges.some((b) => {
    const bStart = new Date(b.start).getTime();
    const bEnd = new Date(b.end).getTime();
    return start < bEnd && end > bStart;
  });
}

async function getBusyRanges(dateStr) {
  const dayStart = parseDate(dateStr);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  if (calendarClient && calendarId) {
    const res = await calendarClient.freebusy.query({
      requestBody: {
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        items: [{ id: calendarId }],
      },
    });
    const busy = res.data.calendars?.[calendarId]?.busy || [];
    return busy.map((b) => ({ start: b.start, end: b.end }));
  }

  return bookings
    .filter((b) => b.date === dateStr)
    .map((b) => ({ start: b.start, end: b.end }));
}

async function getAvailableSlots(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requested = parseDate(dateStr);
  if (requested < today) return [];

  const isWeekend = requested.getDay() === 0 || requested.getDay() === 6;
  if (isWeekend) return [];

  const busy = await getBusyRanges(dateStr);
  const allSlots = generateDaySlots(dateStr);
  const now = Date.now();

  return allSlots.filter((slot) => {
    if (new Date(slot.start).getTime() <= now) return false;
    return !isSlotBooked(slot.start, busy);
  });
}

async function createBooking({ date, start, name, email, notes, service }) {
  const slotEnd = new Date(new Date(start).getTime() + SLOT_MINUTES * 60000);
  const booking = {
    id: crypto.randomUUID(),
    date,
    start,
    end: slotEnd.toISOString(),
    name,
    email,
    notes: notes || "",
    service: service || DEFAULT_SERVICE,
    createdAt: new Date().toISOString(),
  };

  if (calendarClient && calendarId) {
    await calendarClient.events.insert({
      calendarId,
      requestBody: {
        summary: `${booking.service} — ${name}`,
        description: `Email: ${email}\n${notes ? `Notes: ${notes}` : ""}`,
        start: { dateTime: start },
        end: { dateTime: booking.end },
      },
    });
  } else {
    const conflict = bookings.some(
      (b) => b.date === date && isSlotBooked(start, [{ start: b.start, end: b.end }])
    );
    if (conflict) {
      const err = new Error("This time slot is no longer available");
      err.status = 409;
      throw err;
    }
    bookings.push(booking);
  }

  return booking;
}

async function listBookings() {
  if (calendarClient && calendarId) {
    const now = new Date().toISOString();
    const res = await calendarClient.events.list({
      calendarId,
      timeMin: now,
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });
    return (res.data.items || []).map((e) => {
      const desc = e.description || "";
      const emailMatch = desc.match(/Email:\s*(\S+)/);
      const notesMatch = desc.match(/Notes:\s*(.+)/);
      const summary = e.summary || "";
      const parts = summary.split("—");
      return {
        id: e.id,
        service: parts[0]?.trim() || summary,
        name: parts[1]?.trim() || "",
        email: emailMatch ? emailMatch[1] : "",
        notes: notesMatch ? notesMatch[1].trim() : "",
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
        source: "google",
      };
    });
  }
  return bookings.map((b) => ({ ...b, source: "memory" }));
}

module.exports = {
  initGoogleCalendar,
  getAvailableSlots,
  createBooking,
  getBookings: () => [...bookings],
  listBookings,
};
