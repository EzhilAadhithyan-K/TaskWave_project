const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, default: "pending" },
    dueDate: { type: Date },
    priority: {
      type: String,
      required: true,
      enum: ["High", "Medium", "Low"],
    },
    reminderTime: {
      type: String,
      enum: ["10min", "1hr", "1day", "none"],
      default: "none",
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    userId: { type: String, required: true },
    sharedWith: [String],
    lastModifiedBy: { type: String } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);