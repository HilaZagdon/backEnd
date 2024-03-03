const mongoose = require("mongoose");

const EmergencySchema = new mongoose.Schema({
  userID: { type: mongoose.Types.ObjectId, ref: "User" , required: true},
  phone: { type: Number, required: true },
  title: { type: String, required: true },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  hour: { type: String, required: true },
  Reason: { type: String, required: false },
});
const Emergency = mongoose.model("Emergency", EmergencySchema);
module.exports = { Emergency };
