const { Appointment } = require("../models/appointments.model");
const { TestResult } = require("../models/testResults.model");
const { Emergency } = require("../models/emergency.model");
const { Payment } = require("../models/payment.model");

const calculateTotalPrice = (
  appointmentsCount,
  testResultsCount,
  emergenciesCount
) => {
  const appointmentPrice = 10;
  const testResultPrice = 5;
  const emergencyPrice = 10;
  return (
    appointmentsCount * appointmentPrice +
    testResultsCount * testResultPrice +
    emergenciesCount * emergencyPrice
  );
};

const calculatePayment = async (req, res) => {
  try {
    const userID = req.user.id;

    const appointments = await Appointment.find({ userID });
    const testResults = await TestResult.find({ patientID: userID });
    const emergencies = await Emergency.find({ userID });

    const services = [];

    appointments.forEach((appointment) => {
      services.push({ type: "appointment", appointmentID: appointment._id });
    });

    testResults.forEach((testResult) => {
      services.push({ type: "testResult", testResultID: testResult._id });
    });

    emergencies.forEach((emergency) => {
      services.push({ type: "emergency", emergencyID: emergency._id });
    });

    const totalPrice = calculateTotalPrice(
      appointments.length,
      testResults.length,
      emergencies.length
    );

    const payment = new Payment({
      userID,
      services,
      title: "Payment Title",
      date: new Date(),
      hour: "Payment Hour",
      reason: "Payment Reason",
      totalPrice: totalPrice,
    });

    await payment.save();

    res.status(201).json({ payment });
  } catch (error) {
    console.error("Error in calculatePayment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createAppointment = async (req, res) => {
  const body = req.body;
  try {
    body.userID = req.user.id;
    const newAppointment = new Appointment(body);
    newAppointment.id = newAppointment._id;
    await newAppointment.save();
    res.send(newAppointment);
  } catch (err) {
    res.status(400).send("Error");
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { Availability, patient } = req.body;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { Availability, patient },
      { new: true }
    ).populate('doctorID', 'fullName'); // Populate doctorID with fullName field of the User model
    if (!updatedAppointment) {
      return res.status(404).send("Appointment not found");
    }
    res.status(200).json(updatedAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating appointment");
  }
};

const deleteAppointment = async (req, res) => {
  const id = req.params.id;
  try {
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting the Appointment");
  }
};



const getAppointmentsNonSpec = async (req, res) => {
  try {
    const { patient } = req.query;
    let appointments;
    if (patient) {
      appointments = await Appointment.find({ patient: patient }).populate('doctorID', 'fullName'); 
    } else {
      appointments = await Appointment.find().populate('doctorID', 'fullName'); 
    }
    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getAvailableAppointments = async (req, res) => {
  try {
    const { doctorID, date } = req.query;
    
    const formattedDate = new Date(date).toISOString().split('T')[0];

    console.log(formattedDate);
    
    const availableAppointments = await Appointment.find({
      Availability: true,
      doctorID,
      date: { $gte: new Date(formattedDate), $lt: new Date(formattedDate + 'T23:59:59.999Z') }, 
    });
    
    console.log(availableAppointments);
    res.status(200).json(availableAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getUnavailableAppointments = async (req, res) => {
  try {
    const unavailableAppointments = await Appointment.find({
      Availability: false,
    });
    res.status(200).json(unavailableAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAppointmentsForDoctor = async (req, res) => {
  try {
    const doctorID = req.user.id; // Assuming the doctor's ID is stored in the user object

    // Find appointments where the doctorID matches and sort them by date and time
    const appointments = await Appointment.find({ doctorID }).sort({ date: -1, hour: -1 }).populate('patient', 'fullName').exec();

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  getAppointmentsForDoctor,
  updateAppointment,
  deleteAppointment,
  createAppointment,
  getAppointmentsNonSpec,
  getAvailableAppointments,
  getUnavailableAppointments,
  calculatePayment,
};
