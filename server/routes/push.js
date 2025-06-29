const express = require("express");
const webpush = require("web-push");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

let subscriptions = []; // In-memory store (for demo only)

// Set VAPID keys
webpush.setVapidDetails(
  "mailto:" + process.env.REMINDER_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Endpoint to return public VAPID key
router.get("/vapid-public-key", (req, res) => {
  res.status(200).json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Save browser subscription from client
router.post("/subscribe", (req, res) => {
  const subscription = req.body;

  const exists = subscriptions.find((sub) => sub.endpoint === subscription.endpoint);
  if (!exists) {
    subscriptions.push(subscription);
    console.log("✅ New subscription saved");
  }

  res.status(201).json({ message: "Subscribed successfully" });
});

// Notify all subscribers (for testing / reminders)
router.post("/notify", async (req, res) => {
  const payload = JSON.stringify({
    title: "TaskWave Reminder",
    body: req.body.message || "You have tasks due soon!",
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload).catch((err) => {
        console.error("❌ Push error", err);
      })
    )
  );

  res.status(200).json({ message: "Notifications sent", results });
});

module.exports = router;