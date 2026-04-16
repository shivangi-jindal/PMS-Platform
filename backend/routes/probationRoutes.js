const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const {
  getMyProbation,
  reviewProbation
} = require("../controllers/probationController");


//  EMPLOYEE 
// View own probation records
router.get("/my", auth, getMyProbation);


//  MANAGER 
// Review probation (approve/reject)
router.patch(
  "/:id/review",
  auth,
  checkRole("manager"),
  reviewProbation
);


module.exports = router;