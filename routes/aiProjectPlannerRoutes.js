const express = require("express");
const router = express.Router();
const aiProjectPlannerController = require("../controllers/aiProjectPlannerController");

// POST /api/project-planner
router.post("/", aiProjectPlannerController.createPlan);

module.exports = router;
