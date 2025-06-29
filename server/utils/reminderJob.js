const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Task = require("../models/Task");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.REMINDER_EMAIL,
    pass: process.env.REMINDER_PASS,
  },
});

const getReminderOffset = (reminderTime) => {
  switch (reminderTime) {
    case "10min":
      return 10 * 60 * 1000;
    case "1hr":
      return 60 * 60 * 1000;
    case "1day":
      return 24 * 60 * 60 * 1000;
    default:
      return null;
  }
};

cron.schedule("* * * * *", async () => {
  console.log("🔄 Running scheduled task reminder check...");

  const now = new Date();

  try {
    const tasks = await Task.find({
      reminderSent: false,
      reminderTime: { $ne: "none" },
    });

    for (const task of tasks) {
      if (!task.dueDate) continue;

      const due = new Date(task.dueDate);
      const reminderOffset = getReminderOffset(task.reminderTime);
      if (!reminderOffset || isNaN(due.getTime())) continue;

      const reminderTime = new Date(due.getTime() - reminderOffset);

      if (now >= reminderTime && now <= due) {
        const user = await User.findOne({ providerId: task.userId });
        if (!user?.email) continue;

        const mailOptions = {
          from: process.env.REMINDER_EMAIL,
          to: user.email,
          subject: `⏰ Reminder: "${task.title}" is due soon!`,
          text: `Hey ${user.name || ""},\n\nJust a reminder that your task "${task.title}" is due on ${due.toLocaleString()}.\n\nPriority: ${task.priority}\n\n- TaskWave`,
        };

        try {
          await transporter.sendMail(mailOptions);
          task.reminderSent = true;
          await task.save();
          console.log(`📧 Reminder sent to ${user.email} for task "${task.title}"`);
        } catch (emailError) {
          console.error("❌ Email sending failed:", emailError);
        }
      }
    }
  } catch (err) {
    console.error("❌ Reminder job error:", err);
  }
});