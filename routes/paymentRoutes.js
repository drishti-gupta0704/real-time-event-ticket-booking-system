// const express = require("express");

// const { createPaymentOrder ,  verifyPayment } = require("../controllers/paymentController");
// const authMiddleware = require("../middleware/authMiddleware");
// const router = express.Router();

// router.post( "/:bookingId/order",  authMiddleware, createPaymentOrder );
// router.post( "/verify", authMiddleware, verifyPayment );

// module.exports = router;







const express = require("express");

const {
    createPaymentOrder,
    verifyPayment
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/payments/{bookingId}/order:
 *   post:
 *     summary: Create Razorpay payment order
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment order created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.post(
    "/:bookingId/order",
    authMiddleware,
    createPaymentOrder
);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify Razorpay payment
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid payment signature
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);

module.exports = router;