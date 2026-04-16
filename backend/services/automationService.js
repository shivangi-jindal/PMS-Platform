const cron = require("node-cron");
const prisma = require("../prismaClient");

const runProbationCheck = async () => {
  console.log("Running automation...");

  const users = await prisma.user.findMany();

  const today = new Date();

  for (let user of users) {
    const doj = new Date(user.joiningDate);

    const diffDays = Math.floor(
      (today - doj) / (1000 * 60 * 60 * 24)
    );

    // 🔥 DAY 30
    if (diffDays === 30) {
      console.log(`Trigger Day 30 for ${user.name}`);

      await prisma.probation.create({
        data: {
          userId: user.id,
          cycle: "day30"
        }
      });
    }

    // 🔥 DAY 60
    if (diffDays === 60) {
      await prisma.probation.create({
        data: {
          userId: user.id,
          cycle: "day60"
        }
      });
    }

    // 🔥 DAY 80
    if (diffDays === 80) {
      await prisma.probation.create({
        data: {
          userId: user.id,
          cycle: "day80"
        }
      });
    }
  }
};

// ⏰ RUN DAILY
cron.schedule("0 0 * * *", runProbationCheck);

module.exports = runProbationCheck;