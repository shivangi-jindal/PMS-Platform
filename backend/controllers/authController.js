const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Temporary user storage
let users = [];

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role
  };

  users.push(user);

  res.json({ message: "User registered", user });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    "secretkey",
    { expiresIn: "1d" }
  );

  res.json({ message: "Login successful", token });
};