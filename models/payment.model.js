const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema({
  userID: { type: mongoose.Types.ObjectId, ref: "User" },
  services: [
    {
      type: { type: String, required: true },
      serviceID: {
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "services.type",
      },
    },
  ],
  title: { type: String, required: true },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  hour: { type: String, required: true },
  reason: { type: String, required: false },
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = { Payment };
