const { openai, ensureReady, json, error, parseBody } = require("../../server/netlify-helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }
  if (event.httpMethod !== "POST") {
    return error(405, "Method not allowed");
  }

  try {
    await ensureReady();
    const body = parseBody(event);
    if (!body) return error(400, "Invalid JSON body");

    const { message, context } = body;
    if (!message?.trim()) return error(400, "message required");

    const result = await openai.parseBookingIntent(message.trim(), context);
    return json(200, result);
  } catch (err) {
    console.error(err);
    return error(500, err.message || "Server error");
  }
};
