const express = require("express");
const { createBooking , getMyBookings, getBookingById, getAllBookings, cancelBooking} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();

router.post( "/:eventId", authMiddleware, createBooking );
router.get( "/my-bookings", authMiddleware, getMyBookings );
router.get( "/:bookingId", authMiddleware, getBookingById );
router.get("/", authMiddleware, adminMiddleware, getAllBookings);
router.delete( "/:bookingId", authMiddleware, cancelBooking );




module.exports = router;