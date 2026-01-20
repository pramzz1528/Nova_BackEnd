const aiProjectPlannerService = require("../services/aiProjectPlannerService");

exports.createPlan = async (req, res) => {
    try {
        const { idea } = req.body;
        if (!idea) {
            return res.status(400).json({ error: "Project idea is required" });
        }

        const plan = await aiProjectPlannerService.generatePlan(idea);
        res.json({ plan });
    } catch (error) {
        console.error("Project Plan Controller Error:", error);
        res.status(500).json({ error: "Failed to generate plan" });
    }
};
