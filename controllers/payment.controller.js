const { Payment } = require("../models/payment.model");
const { Appointment } = require("../models/appointments.model");
const { TestResult } = require("../models/testResults.model");
const { Emergency } = require("../models/emergency.model");

const calculateTotalPrice = (appointmentsCount, testResultsCount, emergenciesCount) => {
  const appointmentPrice = 10;
  const testResultPrice = 5;
  const emergencyPrice = 10;
  return appointmentsCount * appointmentPrice + testResultsCount * testResultPrice + emergenciesCount * emergencyPrice;
};

const calculatePayment = async (req, res) => {
  try {
    const userID = req.user.id;

    const appointments = await Appointment.find({ userID });
    const testResults = await TestResult.find({ patientID: userID });
    const emergencies = await Emergency.find({ userID });

    const services = [];

    appointments.forEach(appointment => {
      services.push({ type: "appointment", appointmentID: appointment._id });
    });

    testResults.forEach(testResult => {
      services.push({ type: "testResult", testResultID: testResult._id });
    });

    emergencies.forEach(emergency => {
      services.push({ type: "emergency", emergencyID: emergency._id });
    });

    const totalPrice = calculateTotalPrice(appointments.length, testResults.length, emergencies.length); 

    const payment = new Payment({
      userID,
      services,
      title: "Payment Title",
      date: new Date(),
      hour: "Payment Hour",
      reason: "Payment Reason",
      totalPrice: totalPrice 
    });

    await payment.save();

    res.status(201).json({payment });
  } catch (error) {
    console.error("Error in calculatePayment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userID: req.user.id });
    res.status(200).json({payments });
  } catch (error) {
    console.error("Error in getPayments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { calculatePayment, getPayments };

