const express = require("express");
const webpush = require("web-push");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

let subscriptions = []; // This is in-memory. For production, use MongoDB.

webpush.setVapidDetails(
  "mailto:" + process.env.REMINDER_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Save the subscription from the client
router.post("/subscribe", (req, res) => {
  const subscription = req.body;

  // Avoid duplicates
  const exists = subscriptions.find((sub) => sub.endpoint === subscription.endpoint);
  if (!exists) {
    subscriptions.push(subscription);
  }

  res.status(201).json({ message: "Subscribed successfully" });
});

// Send a test push notification to all saved subscriptions
router.post("/notify", async (req, res) => {
  const payload = JSON.stringify({
    title: "TaskWave Reminder",
    body: req.body.message || "You have tasks due soon!",
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload).catch((err) => {
        console.error("Push error", err);
      })
    )
  );

  res.status(200).json({ message: "Notifications sent", results });
});
router.get("/vapid-public-key", (req, res) => {
  res.status(200).json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});
module.exports = router;