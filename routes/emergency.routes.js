const { Router } = require("express");
const router = Router();
const { auth } = require("../middlewares/auth");
const {
  createEmergency,
  getAllEmergencies,
  getEmergencyById,
  deleteEmergency,
  updateEmergency,
} = require("../controllers/emergency.controller");


router.post("/", auth, createEmergency);

router.get("/", auth, getAllEmergencies);

router.get("/:id", auth, getEmergencyById);

router.put("/:id", auth, updateEmergency)

router.delete("/:id", auth, deleteEmergency);

module.exports = router;
