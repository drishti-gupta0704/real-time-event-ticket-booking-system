const express = require("express");
const { createBooking , getMyBookings, getBookingById, cancelBooking} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post( "/:eventId", authMiddleware, createBooking );
router.get( "/my-bookings", authMiddleware, getMyBookings );
router.get( "/:bookingId", authMiddleware, getBookingById );
router.delete( "/:bookingId", authMiddleware, cancelBooking );



module.exports = router;