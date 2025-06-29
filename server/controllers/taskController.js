// controllers/taskController.js
const Task = require('../models/Task');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.REMINDER_EMAIL,
    pass: process.env.REMINDER_PASS,
  },
});

// Create Task
const createTask = async (req, res) => {
  const { title, description, status, dueDate, priority, reminderTime } = req.body;
  const userId = req.user.uid;

  try {
    const task = new Task({
      title,
      description,
      status,
      dueDate,
      priority,
      reminderTime,
      reminderSent: false,
      userId,
      sharedWith: [],
      lastModifiedBy: userId
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Get Tasks with Collaborator Info
const getTasks = async (req, res) => {
  const userId = req.user.uid;

  try {
    const tasks = await Task.find({
      $or: [{ userId }, { sharedWith: userId }]
    }).sort({ createdAt: -1 }).lean();

    const allUids = [...new Set([
      ...tasks.map(task => task.userId),
      ...tasks.flatMap(task => task.sharedWith),
      ...tasks.map(task => task.lastModifiedBy).filter(Boolean)
    ])];

    const users = await User.find({ providerId: { $in: allUids } }).lean();

    const uidToNameMap = {};
    users.forEach(user => {
      uidToNameMap[user.providerId] = user.name || user.email;
    });

    const enhancedTasks = tasks.map(task => ({
      ...task,
      sharedNames: task.sharedWith.map(uid => uidToNameMap[uid] || uid),
      ownerName: uidToNameMap[task.userId] === uidToNameMap[userId] ? "You" : (uidToNameMap[task.userId] || "Unknown"),
      lastModifiedBy: uidToNameMap[task.lastModifiedBy] || "Unknown"
    }));

    res.status(200).json(enhancedTasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Update Task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId !== req.user.uid && !task.sharedWith.includes(req.user.uid)) {
      return res.status(403).json({ error: "Unauthorized to update" });
    }

    updates.lastModifiedBy = req.user.uid;

    const updated = await Task.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId !== req.user.uid && !task.sharedWith.includes(req.user.uid)) {
      return res.status(403).json({ error: "Unauthorized to delete" });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Share Task
const shareTask = async (req, res) => {
  const { taskId, targetEmail } = req.body;
  const userId = req.user.uid;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId !== userId)
      return res.status(403).json({ error: "Unauthorized to share this task" });

    const targetUser = await User.findOne({ email: targetEmail });

    if (targetUser) {
      if (task.sharedWith.includes(targetUser.providerId))
        return res.status(400).json({ error: "Already shared" });

      task.sharedWith.push(targetUser.providerId);
      await task.save();
      return res.status(200).json({ message: "Task shared successfully" });
    } else {
      await transporter.sendMail({
        from: process.env.REMINDER_EMAIL,
        to: targetEmail,
        subject: "TaskWave Collaboration Invite",
        html: `
          <p>Hello!</p>
          <p>You’ve been invited to collaborate on a task in <b>TaskWave</b>.</p>
          <p><b>Task Title:</b> ${task.title}</p>
          <p><b>Due Date:</b> ${task.dueDate?.toDateString()}</p>
          <p>To collaborate, sign up at <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a>.</p>
        `,
      });

      return res.status(200).json({ message: "Invite email sent" });
    }
  } catch (error) {
    console.error("Share Task Error:", error);
    res.status(500).json({ error: "Failed to share task" });
  }
};

// Fetch Collaborators
const getCollaborators = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId !== req.user.uid && !task.sharedWith.includes(req.user.uid)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const users = await User.find({ providerId: { $in: task.sharedWith } });

    const collaborators = users.map(user => ({
      name: user.name,
      email: user.email,
      uid: user.providerId,
    }));

    res.status(200).json({ collaborators });
  } catch (err) {
    console.error("Error fetching collaborators:", err);
    res.status(500).json({ error: "Failed to get collaborators" });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  shareTask,
  getCollaborators
};