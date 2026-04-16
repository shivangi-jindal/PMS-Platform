// CREATE FEEDBACK
const prisma = require("../prismaClient");

// CREATE FEEDBACK
const createFeedback = async (req, res) => {
  try {
    const { toUserId, rating, comment, cycleType } = req.body;

    if (req.user.id === toUserId) {
      return res.status(400).json({
        error: "You cannot give feedback to yourself"
      });
    }

    const feedback = await prisma.feedback.create({
      data: {
        fromUserId: req.user.id,
        toUserId,
        rating,
        comment,
        cycleType
      }
    });

    // FLAG SYSTEM
    if (rating <= 2) {
      const user = await prisma.user.findUnique({
        where: { id: toUserId }
      });

      if (user?.role === "employee") {
        await prisma.flag.create({
          data: {
            userId: toUserId,
            reason: "Low feedback rating",
            severity: "high",
            triggeredByAI: true
          }
        });
      }
    }

    res.json({ message: "Feedback submitted", feedback });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getEmployeeFeedback = async (req, res) => {
  try {
    const userId = req.user.id;

    const feedbacks = await prisma.feedback.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ]
      },
      include: {
        fromUser: true,
        toUser: true
      }
    });

    res.json({
      role: "employee",
      feedbacks
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




const getManagerFeedback = async (req, res) => {
  try {
    const managerId = req.user.id;

    // get team
    const team = await prisma.user.findMany({
      where: { managerId }
    });

    const teamIds = team.map(u => u.id);

    const feedbacks = await prisma.feedback.findMany({
      where: {
        OR: [
          { fromUserId: managerId },
          { toUserId: managerId },
          { fromUserId: { in: teamIds } },
          { toUserId: { in: teamIds } }
        ]
      },
      include: {
        fromUser: true,
        toUser: true
      }
    });

    res.json({
      role: "manager",
      team,
      feedbacks
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAdminFeedback = async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        fromUser: true,
        toUser: true
      }
    });

    res.json({
      role: "admin",
      feedbacks
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTeamFeedback = async (req, res) => {
  try {
    const team = await prisma.user.findMany({
      where: { managerId: req.user.id }
    });

    const teamIds = team.map(u => u.id);

    const feedbacks = await prisma.feedback.findMany({
      where: {
        OR: [
          { fromUserId: { in: teamIds } },
          { toUserId: { in: teamIds } }
        ]
      },
      include: {
        fromUser: true,
        toUser: true
      }
    });

    res.json({ teamFeedbacks: feedbacks });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const reviewFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewNote } = req.body;

    const updated = await prisma.feedback.update({
      where: { id },
      data: {
        status: "reviewed",
        reviewedBy: req.user.id,
        reviewNote
      }
    });

    res.json({
      message: "Feedback reviewed successfully",
      updated
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInsights = async (req, res) => {
  try {
    const total = await prisma.feedback.count();

    const avg = await prisma.feedback.aggregate({
      _avg: { rating: true }
    });

    const low = await prisma.feedback.count({
      where: { rating: { lte: 2 } }
    });

    const high = await prisma.feedback.count({
      where: { rating: { gte: 4 } }
    });

    res.json({
      totalFeedbacks: total,
      averageRating: avg._avg.rating,
      lowRatings: low,
      highRatings: high
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createFeedback,
  getEmployeeFeedback,
  getManagerFeedback,
  getAdminFeedback,
  reviewFeedback,
  getInsights,
  getTeamFeedback
};