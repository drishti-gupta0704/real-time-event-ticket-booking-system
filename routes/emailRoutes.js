
// const express = require("express");

// const { testEmail } = require("../controllers/emailController");
// const authMiddleware = require("../middleware/authMiddleware");
// const router = express.Router();

// router.post("/test", authMiddleware, testEmail);

// module.exports = router;




const express = require("express");
const { testEmail } = require("../controllers/emailController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/email/test:
 *   post:
 *     summary: Send a test email
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/test", authMiddleware, testEmail);

module.exports = router;