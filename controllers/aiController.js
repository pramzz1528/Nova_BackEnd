const aiService = require("../services/aiService");

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const response = await aiService.generateResponse(message, history);

    res.json({
      reply: response,
      model: "LLaMA 3.3 (Groq)",
    });
  } catch (error) {
    console.error("AI CONTROLLER ERROR:", error.message);
    res.status(500).json({
      reply: "AI core temporarily unavailable. Please try again.",
      model: "Fallback Core",
    });
  }
};
