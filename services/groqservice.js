const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error("❌ GROQ_API_KEY missing in .env");
}

exports.chatWithGroq = async ({ message, history = [] }) => {
  const messages = [
    {
      role: "system",
      content: `
You are NOVA, a friendly and intelligent AI chatbot.

Rules:
- Speak naturally like ChatGPT
- Explain things clearly with examples
- Remember conversation context
- NEVER use generic filler like "I've processed your request"
- Be human and helpful
      `.trim()
    },
    ...history.map(m => ({
      role: m.role,
      content: m.content
    })),
    {
      role: "user",
      content: message
    }
  ];

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
      messages,
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.choices[0].message.content;
};
