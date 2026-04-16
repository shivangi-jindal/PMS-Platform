const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token missing" });
    }

    // split Bearer token
    const token = authHeader.split(" ")[1];
    console.log("AUTH HEADER:", req.headers.authorization);

    const decoded = jwt.verify(token, "secretkey");

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;

    next();

  } catch (err) {
    console.log(err.message); // 👈 helpful debug
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = auth;