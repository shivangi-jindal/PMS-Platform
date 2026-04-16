const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const {
  getAllFlags,
  getTeamFlags
} = require("../controllers/flagController");

// ADMIN → ALL FLAGS
router.get(
  "/",
  auth,
  checkRole("admin"),
  getAllFlags
);

// MANAGER → TEAM FLAGS
router.get(
  "/team",
  auth,
  checkRole("manager"),
  getTeamFlags
);

module.exports = router;