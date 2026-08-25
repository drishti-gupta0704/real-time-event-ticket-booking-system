const express = require("express");

const { createPaymentOrder } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post( "/:bookingId/order",  authMiddleware, createPaymentOrder);

module.exports = router;