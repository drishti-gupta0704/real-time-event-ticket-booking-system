
// const express = require("express");

// const { generateSeats,getEventSeats,getSeatById } = require("../controllers/seatController");
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

// const router = express.Router();
// router.post( "/:eventId/generate", authMiddleware, adminMiddleware, generateSeats);
// router.get( "/event/:eventId",getEventSeats);
// router.get("/:seatId",getSeatById );

// module.exports = router;




const express = require("express");

const {
    generateSeats,
    getEventSeats,
    getSeatById
} = require("../controllers/seatController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/seats/{eventId}/generate:
 *   post:
 *     summary: Generate seats for an event
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Seats generated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post(
    "/:eventId/generate",
    authMiddleware,
    adminMiddleware,
    generateSeats
);

/**
 * @swagger
 * /api/seats/event/{eventId}:
 *   get:
 *     summary: Get all seats for an event
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seats fetched successfully
 *       404:
 *         description: Event not found
 */
router.get("/event/:eventId", getEventSeats);

/**
 * @swagger
 * /api/seats/{seatId}:
 *   get:
 *     summary: Get seat by ID
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat fetched successfully
 *       404:
 *         description: Seat not found
 */
router.get("/:seatId", getSeatById);

module.exports = router;