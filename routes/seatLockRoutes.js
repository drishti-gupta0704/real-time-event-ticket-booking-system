
// const express = require("express");
// const {lockSeats } = require("../controllers/seatController");
// const authMiddleware = require("../middleware/authMiddleware");
// const router = express.Router();

// router.post( "/:eventId/lock",authMiddleware,lockSeats );

// module.exports = router;







const express = require("express");

const { lockSeats } = require("../controllers/seatController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/seats/{eventId}/lock:
 *   post:
 *     summary: Lock seats for an event
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: Seats locked successfully
 *       400:
 *         description: Invalid seat request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: One or more seats are unavailable
 */
router.post(
    "/:eventId/lock",
    authMiddleware,
    lockSeats
);

module.exports = router;