const smartCodeReviewService = require("../services/smartCodeReviewService");

exports.reviewCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }

        const review = await smartCodeReviewService.analyzeCode(code);
        res.json({ review });
    } catch (error) {
        console.error("Code Review Controller Error:", error);
        res.status(500).json({ error: "Failed to generate review" });
    }
};
