// utils/webpush.js
const webpush = require("web-push");
const dotenv = require("dotenv");
dotenv.config();

webpush.setVapidDetails(
  "mailto:" + process.env.REMINDER_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;