const admin = require("../firebase");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

const createUser = async (req, res) => {
  const { uid, name, email } = req.body;
  try {
    const userExists = await User.findOne({ uid });
    if (!userExists) {
      const newUser = new User({ uid, providerId: uid, name, email });
      await newUser.save();
    }
    res.status(200).json({ message: "User verified/created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { verifyToken, createUser };
