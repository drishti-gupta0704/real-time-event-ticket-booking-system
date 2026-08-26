// const express = require("express");
// const { createBooking , getMyBookings, getBookingById, getAllBookings, cancelBooking} = require("../controllers/bookingController");
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");
// const router = express.Router();

// router.post( "/:eventId", authMiddleware, createBooking );
// router.get( "/my-bookings", authMiddleware, getMyBookings );
// router.get( "/:bookingId", authMiddleware, getBookingById );
// router.get("/", authMiddleware, adminMiddleware, getAllBookings);
// router.delete( "/:bookingId", authMiddleware, cancelBooking );




// module.exports = router;







const express = require("express");

const {
    createBooking,
    getMyBookings,
    getBookingById,
    getAllBookings,
    cancelBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/bookings/{eventId}:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid booking request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Seat is unavailable or not locked
 */
router.post("/:eventId", authMiddleware, createBooking);

/**
 * @swagger
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Get my bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: User bookings fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/my-bookings", authMiddleware, getMyBookings);

/**
 * @swagger
 * /api/bookings/{bookingId}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.get("/:bookingId", authMiddleware, getBookingById);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: All bookings fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/", authMiddleware, adminMiddleware, getAllBookings);

/**
 * @swagger
 * /api/bookings/{bookingId}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.delete("/:bookingId", authMiddleware, cancelBooking);

module.exports = router;