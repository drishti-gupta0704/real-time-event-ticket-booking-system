const express = require("express");

const { createPaymentOrder ,  verifyPayment } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post( "/:bookingId/order",  authMiddleware, createPaymentOrder );
router.post( "/verify", authMiddleware, verifyPayment );

module.exports = router;