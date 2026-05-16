process.env.NETLIFY = "true";

const calendar = require("./calendar");
const openai = require("./openai");

let ready = null;

function ensureReady() {
  if (!ready) {
    ready = calendar.initGoogleCalendar();
  }
  return ready;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

function error(statusCode, message) {
  return json(statusCode, { error: message });
}

function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    return null;
  }
}

function checkAdminKey(event) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) {
    return {
      ok: false,
      message: "ADMIN_KEY is not set. Add it in Netlify → Site configuration → Environment variables, then redeploy.",
      status: 503,
    };
  }
  const provided =
    event.queryStringParameters?.key ||
    event.headers?.["x-admin-key"] ||
    event.headers?.["X-Admin-Key"];
  if (provided !== expected) {
    return { ok: false, message: "Wrong password. Use the exact ADMIN_KEY from Netlify.", status: 401 };
  }
  return { ok: true };
}

module.exports = { calendar, openai, ensureReady, json, error, parseBody, checkAdminKey };
