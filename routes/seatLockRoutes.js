
const express = require("express");
const {lockSeats } = require("../controllers/seatController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post( "/:eventId/lock",authMiddleware,lockSeats );

module.exports = router;