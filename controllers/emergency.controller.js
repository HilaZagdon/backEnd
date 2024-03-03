const { Appointment } = require("../models/appointments.model");
const { TestResult } = require("../models/testResults.model");
const { Emergency } = require("../models/emergency.model");
const { Payment } = require("../models/payment.model");

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

    res.status(201).json({ payment });
  } catch (error) {
    console.error("Error in calculatePayment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const createEmergency = async (req, res) => {
  const { phone, title, hour, Reason } = req.body;
  try {
    const newEmergency = new Emergency({
      userID: req.user.id,
      phone,
      title,
      hour,
      Reason,
    });
    await newEmergency.save();
    res.status(201).json(newEmergency);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllEmergencies = async (req, res) => {
  const { userID } = req.query;
  try {
    let emergencies;
    if (req.user.role === "doctor" && userID) {
      emergencies = await Emergency.find({ userID });
    } else if (req.user.role === "doctor") {
      emergencies = await Emergency.find();
    } else {
      emergencies = await Emergency.find({ userID: req.user.id });
    }
    res.status(200).json({emergencies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateEmergency = async (req, res) => {
  const id = req.params.id;
  const { phone, title, hour, Reason } = req.body;
  try {
    const emergency = await Emergency.findById(id);
    if (!emergency) {
      return res.status(404).json({ error: "Emergency not found" });
    }
    
    if (req.user.role === "patient" && emergency.userID.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    emergency.phone = phone;
    emergency.title = title;
    emergency.hour = hour;
    emergency.Reason = Reason;

    await emergency.save();
    
    res.status(200).json({emergency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getEmergencyById = async (req, res) => {
  const id = req.params.id;
  try {
    const emergency = await Emergency.findById(id);
    if (!emergency) {
      return res.status(404).json({ error: "Emergency not found" });
    }
    res.status(200).json(emergency);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteEmergency = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedEmergency = await Emergency.findByIdAndDelete(id);
    if (!deletedEmergency) {
      return res.status(404).json({ error: "Emergency not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { createEmergency, getAllEmergencies, getEmergencyById, updateEmergency, deleteEmergency, calculatePayment };

