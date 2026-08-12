
const express = require("express");

const { generateSeats,getEventSeats,getSeatById } = require("../controllers/seatController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();
router.post( "/:eventId/generate", authMiddleware, adminMiddleware, generateSeats);
router.get( "/event/:eventId",getEventSeats);
router.get("/:seatId",getSeatById );

module.exports = router;
