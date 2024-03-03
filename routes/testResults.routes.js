const { Router } = require("express");
const router = Router();
const { auth } = require("../middlewares/auth");
const { addTestResult, getTestResults, deleteTestResult, updateTestResult, getTestResultsByPatientId } = require("../controllers/testResults.controller");

router.post("/", auth, addTestResult);

router.delete("/:id", auth, deleteTestResult)

router.put("/:id", auth, updateTestResult);

router.get("/", auth, getTestResults);

router.get("/:patientId", auth, getTestResultsByPatientId);


module.exports = router;