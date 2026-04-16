const express = require("express");
const app = express();
const cors = require("cors");
require("./services/automationService");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
require("dotenv").config();

app.use(express.json());

// IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");

// USE ROUTES
app.use("/api/auth", authRoutes);


const goalRoutes = require("./routes/goalRoutes");

app.use("/api/goals", goalRoutes);


// const userRoutes = require("./routes/userRoutes");

// app.use("/api/users", userRoutes);

const feedbackRoutes = require("./routes/feedbackRoutes");

app.use("/api/feedback", feedbackRoutes);

const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);

const probationRoutes = require("./routes/probationRoutes");

app.use("/api/probation", probationRoutes);

const flagRoutes = require("./routes/flagRoutes");

app.use("/api/flags", flagRoutes);


app.get("/", (req, res) => {
  res.send("PMS Backend Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});