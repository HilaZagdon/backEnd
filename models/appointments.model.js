const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema({
  doctorID: { type: mongoose.Types.ObjectId, ref: "User" },
  location: { type: String, required: false },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  hour: { type: String, required: true },
  Availability: { type: Boolean, required: true, default: true },
  patient: { type: mongoose.Types.ObjectId, ref: "User", default: null },
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = { Appointment };
