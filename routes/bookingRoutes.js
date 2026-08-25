const express = require("express");
const { createBooking} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post( "/:eventId", authMiddleware, createBooking );


module.exports = router;