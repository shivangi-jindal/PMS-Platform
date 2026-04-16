
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const {
  createFeedback,
  getEmployeeFeedback,
  getManagerFeedback,
  getAdminFeedback,
  reviewFeedback,
  getInsights
} = require("../controllers/feedbackController");


router.post(
  "/create",
  auth,
  checkRole("employee", "manager"),
  createFeedback
);

router.get(
  "/employee",
  auth,
  checkRole("employee"),
  getEmployeeFeedback
);

router.get(
  "/manager",
  auth,
  checkRole("manager"),
  getManagerFeedback
);

router.get(
  "/admin",
  auth,
  checkRole("admin"),
  getAdminFeedback
);

router.patch(
  "/review/:id",
  auth,
  checkRole("manager", "admin"),
  reviewFeedback
);

router.get(
  "/insights",
  auth,
  checkRole("admin"),
  getInsights
);

module.exports = router;