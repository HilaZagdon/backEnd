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

    res.status(201).json({payment });
  } catch (error) {
    console.error("Error in calculatePayment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const addTestResult = async (req, res) => {
  const { patientID, title, categories } = req.body;
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (!patientID) {
      return res.status(400).json({ error: "Patient ID is required" });
    }


    const newTestResult = new TestResult({
      patientID, 
      title,
      categories,
    });

    await newTestResult.save();
    res.status(201).json({newTestResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getTestResults = async (req, res) => {
  try {
    let testResults;
    if (req.user.role === "doctor") {

      testResults = await TestResult.find();
    } else {

      testResults = await TestResult.find({ patientID: req.user.id });
    }
    res.status(200).json(testResults );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteTestResult = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedTestResult = await TestResult.findByIdAndDelete(id);
    if (!deletedTestResult) {
      return res.status(404).json({ error: "Test result not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTestResult = async (req, res) => {
  const id = req.params.id;
  const { title, categories } = req.body;
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedTestResult = await TestResult.findByIdAndUpdate(
      id,
      { title, categories },
      { new: true }
    );

    if (!updatedTestResult) {
      return res.status(404).json({ error: "Test result not found" });
    }

    res.status(200).json({ updatedTestResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTestResultsByPatientId = async (req, res) => {
  try {
    let testResults;
    if (req.user.role === "doctor") {
      testResults = await TestResult.find({ patientID: req.params.patientId });
    } else {

      testResults = await TestResult.find({ patientID: req.user.id });
    }
    res.status(200).json({testResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { addTestResult, getTestResults, deleteTestResult, updateTestResult, getTestResultsByPatientId, calculatePayment };