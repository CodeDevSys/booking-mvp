const { openai, json } = require("../../server/netlify-helpers");

exports.handler = async () => {
  return json(200, {
    ok: true,
    calendar: !!process.env.GOOGLE_CALENDAR_ID,
    ai: openai.isEnabled(),
  });
};
