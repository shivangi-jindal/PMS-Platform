const express = require("express");
const router = express.Router();
const checkRole = require("../middleware/roleMiddleware");
const auth = require("../middleware/authMiddleware");



const {
  createGoal,
  getUserGoals,
  getAllGoals,
  deleteGoal,
  approveGoal,
  rejectGoal,
  updateProgress   
} = require("../controllers/goalController");

// 🔐 PROTECTED ROUTES
router.post("/create", auth, checkRole("employee", "manager"), createGoal);
router.get("/my", auth, getUserGoals);
router.get("/all", auth, checkRole("manager", "admin"), getAllGoals);

router.patch("/:id/approve", auth, checkRole("manager"), approveGoal);
router.patch("/:id/reject", auth, checkRole("manager"), rejectGoal);

router.delete(
  "/:id",
  auth,
  checkRole("employee", "manager", "admin"),
  deleteGoal
);

router.patch("/:id/progress", auth, updateProgress);

module.exports = router;