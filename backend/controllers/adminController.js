const prisma = require("../prismaClient");


const getInsights = async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany();

    const total = feedbacks.length;

    const avgRating =
      feedbacks.reduce((acc, f) => acc + f.rating, 0) / total;

    const lowRatings = feedbacks.filter(f => f.rating <= 2);

    res.json({
      totalFeedbacks: total,
      averageRating: avgRating,
      lowPerformanceCount: lowRatings.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getInsights };