const prisma = require("../prismaClient");

// ADMIN → GET ALL FLAGS
const getAllFlags = async (req, res) => {
  try {
    const flags = await prisma.flag.findMany({
      include: {
        user: true
      }
    });

    res.json(flags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MANAGER → TEAM FLAGS
const getTeamFlags = async (req, res) => {
  try {
    const managerId = req.user.id;

    const team = await prisma.user.findMany({
      where: { managerId }
    });

    const teamIds = team.map(u => u.id);

    const flags = await prisma.flag.findMany({
      where: {
        userId: { in: teamIds }
      },
      include: {
        user: true
      }
    });

    res.json(flags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllFlags,
  getTeamFlags
};