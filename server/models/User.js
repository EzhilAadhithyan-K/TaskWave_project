const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  providerId: { type: String, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  provider: { type: String, default: "google" }
});

module.exports = mongoose.model("User", UserSchema);