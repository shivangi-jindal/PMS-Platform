
const prisma = require("../prismaClient");

// ================= CREATE GOAL =================
const createGoal = async (req, res) => {
  try {
    const { title, description, weightage, priority, deadline } = req.body;
    const userId = req.user.id;

    // 🔥 WEIGHTAGE RANGE VALIDATION (Bug Fix #3 — missing validation)
    if (!weightage || weightage <= 0 || weightage > 100) {
      return res.status(400).json({
        error: "Weightage must be between 1 and 100"
      });
    }

    // 🔥 TOTAL WEIGHTAGE VALIDATION
    const existingGoals = await prisma.goal.findMany({
      where: {
        userId,
        status: { in: ["pending", "approved"] }
      }
    });

    const totalWeight = existingGoals.reduce((sum, g) => sum + g.weightage, 0);

    if (totalWeight + weightage > 100) {
      return res.status(400).json({
        error: `Total weightage cannot exceed 100%. You have ${100 - totalWeight}% remaining.`
      });
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        userId,
        weightage,
        priority,
        deadline: deadline ? new Date(deadline) : null
      }
    });

    res.json({ message: "Goal created successfully", goal });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= GET USER GOALS =================
const getUserGoals = async (req, res) => {
  try {
    const user = req.user;
    let goals;

    // 👨 Employee → own goals only
    if (user.role === "employee") {
      goals = await prisma.goal.findMany({
        where: { userId: user.id }
      });
    }

    // 👨‍💼 Manager → own goals + team goals (Bug Fix #5 — managers had no personal goals)
    else if (user.role === "manager") {
      const team = await prisma.user.findMany({
        where: { managerId: user.id },
        select: { id: true }
      });

      const teamIds = team.map(u => u.id);

      goals = await prisma.goal.findMany({
        where: {
          userId: { in: [...teamIds, user.id] } // ✅ includes manager's own goals
        }
      });
    }

    // 🧑 Admin → all goals
    else {
      goals = await prisma.goal.findMany({
        include: { user: true }
      });
    }

    res.json(goals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= GET ALL GOALS =================
const getAllGoals = async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      include: { user: true }
    });

    res.json(goals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= DELETE GOAL =================
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await prisma.goal.findUnique({ where: { id } });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const user = req.user;

    // 👨 Employee → only own goals
    if (user.role === "employee") {
      if (goal.userId !== user.id) {
        return res.status(403).json({
          error: "Employees can only delete their own goals"
        });
      }
    }

    // 👨‍💼 Manager → only team goals
    else if (user.role === "manager") {
      const employee = await prisma.user.findUnique({
        where: { id: goal.userId }
      });

      if (!employee || employee.managerId !== user.id) {
        return res.status(403).json({
          error: "Managers can only delete their team's goals"
        });
      }
    }

    // 🧑 Admin → FULL ACCESS (no restriction)

    await prisma.goal.delete({ where: { id } });

    res.json({ message: "Goal deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= APPROVE GOAL =================
const approveGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await prisma.goal.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const user = req.user;

    // 🔥 Manager → can only approve their team's goals
    if (user.role === "manager") {
      if (goal.user.managerId !== user.id) {
        return res.status(403).json({
          error: "You can only approve goals of your team members"
        });
      }
    }
    // 🧑 Admin → can approve any goal (Bug Fix #4 — admin was blocked before)
    else if (user.role !== "admin") {
      return res.status(403).json({
        error: "Only managers and admins can approve goals"
      });
    }

    // 🔥 Prevent re-approving already approved/completed goals
    if (goal.status === "approved" || goal.status === "completed") {
      return res.status(400).json({
        error: "Goal is already approved or completed"
      });
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: { status: "approved" }
    });

    res.json({ message: "Goal approved successfully", updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= REJECT GOAL =================
const rejectGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await prisma.goal.findUnique({ where: { id } });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const user = req.user;

    if (user.role === "manager") {
      const employee = await prisma.user.findUnique({
        where: { id: goal.userId }
      });

      if (!employee || employee.managerId !== user.id) {
        return res.status(403).json({
          error: "You can only reject your team's goals"
        });
      }
    } else if (user.role !== "admin") {
      return res.status(403).json({
        error: "Only managers and admins can reject goals"
      });
    }

    // 🔥 Prevent rejecting already completed goals
    if (goal.status === "completed") {
      return res.status(400).json({
        error: "Cannot reject a completed goal"
      });
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: { status: "rejected" }
    });

    res.json({ message: "Goal rejected", updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= UPDATE PROGRESS =================
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    // 🔥 VALIDATION
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        error: "Progress must be between 0 and 100"
      });
    }

    const goal = await prisma.goal.findUnique({ where: { id } });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    // 🔥 Must be approved first
    if (goal.status !== "approved") {
      return res.status(400).json({
        error: "Goal must be approved before updating progress"
      });
    }

    // ✅ REMOVED the contradictory block (Bug Fix #1):
    // Old buggy code was blocking approved goals AFTER requiring them to be approved.
    // That made updateProgress impossible for any goal.

    // 🔥 Only owner, their manager, or admin can update progress (Bug Fix #2)
    const isOwner = goal.userId === req.user.id;

    let isManager = false;
    if (!isOwner && req.user.role === "manager") {
      const employee = await prisma.user.findUnique({
        where: { id: goal.userId }
      });
      isManager = employee?.managerId === req.user.id;
    }

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isManager && !isAdmin) {
      return res.status(403).json({
        error: "You are not authorized to update this goal's progress"
      });
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        progress,
        status: progress === 100 ? "completed" : "approved"
      }
    });

    res.json({ message: "Progress updated successfully", updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= EXPORT =================
module.exports = {
  createGoal,
  getUserGoals,
  getAllGoals,
  deleteGoal,
  approveGoal,
  rejectGoal,
  updateProgress
};
