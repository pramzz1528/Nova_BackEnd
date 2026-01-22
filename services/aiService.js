const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.generateResponse = async (message, history = []) => {
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are NOVA, an intelligent AI assistant. Be helpful, clear, and precise.",
      },
      ...history.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("GROQ ERROR:", err.message);
    throw new Error("Groq AI failed");
  }
};

