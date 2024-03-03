const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
  patientID: { type: mongoose.Types.ObjectId, ref: "User", required: true }, 
  title: { type: String, required: true },
  date: {
    type: Date,
    required: false,
    default: new Date(),
  },
  categories: [
    {
      name: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
});
const TestResult = mongoose.model("TestResult", testResultSchema);

module.exports = { TestResult };