// user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: false },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    default: "patient",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
