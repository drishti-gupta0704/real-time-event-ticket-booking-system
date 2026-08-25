
const express = require("express");

const { testEmail } = require("../controllers/emailController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/test", authMiddleware, testEmail);

module.exports = router;