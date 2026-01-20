const express = require("express");
const router = express.Router();
const smartCodeReviewController = require("../controllers/smartCodeReviewController");

// POST /api/code-review
router.post("/", smartCodeReviewController.reviewCode);

module.exports = router;
