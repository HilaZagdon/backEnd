const { Router } = require("express");
const router = Router();
const { auth } = require("../middlewares/auth");
const {
  updateAppointment,
  deleteAppointment,
  createAppointment,
  getAppointmentsNonSpec,
  getAvailableAppointments,
  getUnavailableAppointments,
  getAppointmentsForDoctor,
} = require("../controllers/appointments.controller");


router.put("/:id", auth, updateAppointment);

router.delete("/:id", auth, deleteAppointment);

router.get("/", auth, getAppointmentsNonSpec);

router.get("/available", getAvailableAppointments);

router.get("/unavailable", getUnavailableAppointments);

router.post("/", auth, createAppointment);

router.get("/doctor-appointments", auth, getAppointmentsForDoctor);


module.exports = router;
