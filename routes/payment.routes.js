const { Router } = require("express");
const router = Router();
const { auth } = require("../middlewares/auth");
const { calculatePayment, getPayments } = require("../controllers/payment.controller");

router.post("/", auth, calculatePayment);

router.get("/", auth, getPayments);

module.exports = router;
