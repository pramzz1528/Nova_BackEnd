const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const automationRoutes = require("./routes/automationRoutes");
const skillRoutes = require("./routes/skillRoutes");
const smartCodeReviewRoutes = require("./routes/smartCodeReviewRoutes");
const aiProjectPlannerRoutes = require("./routes/aiProjectPlannerRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get("/health", (req, res) => res.json({ status: "NOVA Backend is healthy", timestamp: new Date() }));

const taskRoutes = require("./routes/taskRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/automation", automationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/code-review", smartCodeReviewRoutes);
app.use("/api/project-planner", aiProjectPlannerRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reminders", reminderRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`
=========================================
 🚀 NOVA Backend Running
 🌐 http://localhost:${PORT}
=========================================
`);
});
