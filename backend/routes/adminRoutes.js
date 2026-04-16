const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const { getInsights } = require("../controllers/adminController");

// 👑 Admin only
router.get("/insights", auth, checkRole("admin"), getInsights);

module.exports = router;