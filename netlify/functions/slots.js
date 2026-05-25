const { calendar, ensureReady, json, error } = require("../../server/netlify-helpers");

exports.handler = async (event) => {
  try {
    await ensureReady();
    const date = event.queryStringParameters?.date;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return error(400, "date query required (YYYY-MM-DD)");
    }
    const slots = await calendar.getAvailableSlots(date, {
      timezoneOffset: event.queryStringParameters?.tzOffset,
    });
    return json(200, { date, slots });
  } catch (err) {
    console.error(err);
    return error(500, err.message || "Server error");
  }
};
