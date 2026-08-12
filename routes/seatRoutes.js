
const express = require("express");

const { generateSeats,getEventSeats } = require("../controllers/seatController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();
router.post( "/:eventId/generate", authMiddleware, adminMiddleware, generateSeats);
router.get( "/event/:eventId",getEventSeats);

module.exports = router;
