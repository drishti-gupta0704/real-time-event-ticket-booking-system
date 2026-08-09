
const express = require("express");
const { createEvent ,  getAllEvents} = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/",authMiddleware,adminMiddleware,createEvent);
router.get("/", getAllEvents);

module.exports = router;