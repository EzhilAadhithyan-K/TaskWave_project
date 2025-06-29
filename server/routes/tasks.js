const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const taskRateLimiter = require("../middleware/ratelimit"); // ✅ Import rate limiter

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  shareTask,
  getCollaborators,
} = require("../controllers/taskController");

// ✅ Shared validator error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// === Create Task ===
router.post(
  "/",
  taskRateLimiter, // ✅ Rate limit applied
  verifyToken,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("status").optional().isIn(["pending", "completed"]),
    body("priority").optional().isIn(["Low", "Medium", "High"]),
  ],
  validate,
  createTask
);

// === Get Tasks (with pagination) ===
router.get(
  "/",
  taskRateLimiter,
  verifyToken,
  [
    query("limit").optional().isInt({ min: 1 }),
    query("page").optional().isInt({ min: 1 }),
  ],
  validate,
  getTasks
);

// === Update Task ===
router.put(
  "/:id",
  taskRateLimiter,
  verifyToken,
  [
    param("id").isMongoId().withMessage("Invalid task ID"),
    body("title").optional().notEmpty(),
    body("status").optional().isIn(["pending", "completed"]),
    body("priority").optional().isIn(["Low", "Medium", "High"]),
  ],
  validate,
  updateTask
);

// === Delete Task ===
router.delete(
  "/:id",
  taskRateLimiter,
  verifyToken,
  [param("id").isMongoId().withMessage("Invalid task ID")],
  validate,
  deleteTask
);

// === Share Task ===
router.post(
  "/share",
  taskRateLimiter,
  verifyToken,
  [
    body("taskId").notEmpty().isMongoId().withMessage("Task ID is required"),
    body("email").isEmail().withMessage("Valid email is required"),
  ],
  validate,
  shareTask
);

// === Get Collaborators ===
router.get(
  "/:id/collaborators",
  taskRateLimiter,
  verifyToken,
  [param("id").isMongoId().withMessage("Invalid task ID")],
  validate,
  getCollaborators
);

module.exports = router;