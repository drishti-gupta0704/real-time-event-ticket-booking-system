
const express = require("express");
const { createEvent ,  getAllEvents , getEventById , searchEvents, updateEvent, deleteEvent} = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/",authMiddleware,adminMiddleware,createEvent);
router.get("/", getAllEvents);
router.get("/search", searchEvents);
router.get("/:id", getEventById);
router.put("/:id", authMiddleware, adminMiddleware, updateEvent );
router.delete( "/:id", authMiddleware, adminMiddleware, deleteEvent );


module.exports = router;

