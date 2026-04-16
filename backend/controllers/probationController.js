const prisma = require("../prismaClient");

// ✅ ADD THIS (MISSING FUNCTION)
const getMyProbation = async (req, res) => {
  try {
    const userId = req.user.id;

    const records = await prisma.probation.findMany({
      where: { userId }
    });

    res.json(records);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const reviewProbation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, score, reviewNote } = req.body;

    const probation = await prisma.probation.findUnique({
      where: { id }
    });

    if (!probation) {
      return res.status(404).json({ error: "Record not found" });
    }

    const employee = await prisma.user.findUnique({
      where: { id: probation.userId }
    });

    if (employee.managerId !== req.user.id) {
      return res.status(403).json({
        error: "You can only review your team"
      });
    }

    const updated = await prisma.probation.update({
      where: { id },
      data: {
        status,
        score,
        reviewNote,
        reviewedBy: req.user.id
      }
    });

    res.json({
      message: "Probation reviewed",
      updated
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMyProbation,
  reviewProbation
};