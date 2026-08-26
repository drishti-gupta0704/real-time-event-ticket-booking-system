
// const express = require("express");
// const { createEvent ,  getAllEvents , getEventById , searchEvents, updateEvent, deleteEvent} = require("../controllers/eventController");
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

// const router = express.Router();

// router.post("/",authMiddleware,adminMiddleware,createEvent);
// router.get("/", getAllEvents);
// router.get("/search", searchEvents);
// router.get("/:id", getEventById);
// router.put("/:id", authMiddleware, adminMiddleware, updateEvent );
// router.delete( "/:id", authMiddleware, adminMiddleware, deleteEvent );


// module.exports = router;




const express = require("express");

const {
    createEvent,
    getAllEvents,
    getEventById,
    searchEvents,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/", authMiddleware, adminMiddleware, createEvent);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Events fetched successfully
 */
router.get("/", getAllEvents);

/**
 * @swagger
 * /api/events/search:
 *   get:
 *     summary: Search events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", searchEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event fetched successfully
 *       404:
 *         description: Event not found
 */
router.get("/:id", getEventById);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;