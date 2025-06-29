const express = require("express");
const router = express.Router();
const { verifyToken, createUser } = require("../controllers/authController");

router.post("/verify", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/create", createUser);

module.exports = router;