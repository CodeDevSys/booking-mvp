const { calendar, ensureReady, json, error, parseBody, checkAdminKey } = require("../../server/netlify-helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }

  if (event.httpMethod === "GET") {
    const auth = checkAdminKey(event);
    if (!auth.ok) return error(auth.status || 401, auth.message);
    try {
      await ensureReady();
      const bookings = await calendar.listBookings();
      return json(200, { bookings });
    } catch (err) {
      console.error(err);
      return error(500, err.message || "Server error");
    }
  }

  if (event.httpMethod === "DELETE") {
    const auth = checkAdminKey(event);
    if (!auth.ok) return error(auth.status || 401, auth.message);
    try {
      await ensureReady();
      const deleted = await calendar.deleteBooking(event.queryStringParameters?.id);
      return json(200, { deleted });
    } catch (err) {
      console.error(err);
      return error(err.status || 500, err.message || "Server error");
    }
  }

  if (event.httpMethod !== "POST") {
    return error(405, "Method not allowed");
  }

  try {
    await ensureReady();
    const body = parseBody(event);
    if (!body) return error(400, "Invalid JSON body");

    const { date, start, name, email, notes, service } = body;
    if (!date || !start || !name || !email) {
      return error(400, "date, start, name, and email are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error(400, "invalid email");
    }

    const booking = await calendar.createBooking({
      date,
      start,
      name: name.trim(),
      email: email.trim(),
      notes,
      service,
    });
    return json(201, { booking });
  } catch (err) {
    console.error(err);
    return error(err.status || 500, err.message || "Server error");
  }
};
