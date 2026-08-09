
const express = require("express");
const { createEvent } = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/",authMiddleware,adminMiddleware,createEvent);
module.exports = router;