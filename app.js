const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/user.routes");
const appointmentsRouter = require("./routes/appointments.routes");
const testResults = require("./routes/testResults.routes");
const emergencyRouter = require("./routes/emergency.routes");
const paymentRouter = require("./routes/payment.routes");
// const avatarRouter = require("./routes/avatar.routes");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cors());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/appointments", appointmentsRouter);
app.use("/api/v1/testResults", testResults);
app.use("/api/v1/emergency", emergencyRouter);
app.use("/api/v1/payment", paymentRouter);
// app.use("/api/v1/avatar", avatarRouter);

module.exports = { app };
