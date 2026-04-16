const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");

// REGISTER USER 
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        managerId: role === "employee" ? managerId : null
      }
    });

    //  Create probation cycles (only for employees)
    if (role === "employee") {
      await prisma.probation.createMany({
        data: [
          { userId: user.id, cycle: "day30" },
          { userId: user.id, cycle: "day60" },
          { userId: user.id, cycle: "day80" }
        ]
      });
    }

    res.json({
      message: "User created successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const jwt = require("jsonwebtoken");

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    //  Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET, // later move to .env
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};