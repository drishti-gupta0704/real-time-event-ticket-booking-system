
const express = require("express");
const { createEvent ,  getAllEvents, getEventById} = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/",authMiddleware,adminMiddleware,createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);

module.exports = router;

