const express = require("express");
const OpenAI = require("openai");
const axios = require("axios");

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
    const { message, context } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are NOVA, a helpful AI assistant." },
                { role: "user", content: message },
            ],
        });

        return res.json({
            reply: completion.choices[0].message.content,
            model: "gpt-4o-mini",
        });

    } catch (openaiErr) {
        // Fallback to Gemini
        try {
            const geminiRes = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    contents: [{ parts: [{ text: message }] }],
                }
            );

            return res.json({
                reply: geminiRes.data.candidates[0].content.parts[0].text,
                model: "gemini-1.5-flash",
            });

        } catch {
            return res.status(500).json({
                reply: "NOVA core active. How can I assist you?",
                model: "NOVA Brain",
            });
        }
    }
});

module.exports = router;
