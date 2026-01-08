const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => res.json({ status: "NOVA Backend is healthy", timestamp: new Date() }));

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`
=========================================
 🚀 NOVA Backend Running
 🌐 http://localhost:${PORT}
=========================================
`);
});
