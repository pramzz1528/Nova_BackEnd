// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const OpenAI = require("openai");

// /**
//  * AI Service
//  * Handles processing of messages with automatic fallback and fail-safe.
//  */
// exports.generateResponse = async (prompt, history = []) => {
//   // Ensure history is an array
//   const safeHistory = Array.isArray(history) ? history : [];

//   // Check for provider override in prompt or env
//   const primaryProvider = process.env.AI_PROVIDER || 'gemini';
//   const secondaryProvider = primaryProvider === 'gemini' ? 'openai' : 'gemini';

//   console.log(`[AI] System Init: Default(${primaryProvider})`);

//   try {
//     console.log(`[AI] Trying primary: ${primaryProvider}`);
//     const result = await (primaryProvider === 'gemini' ? runGemini(prompt, safeHistory) : runOpenAI(prompt, safeHistory));
//     return result;
//   } catch (err) {
//     console.warn(`[AI] Primary failed (${primaryProvider}):`, err.message);
//     try {
//       console.log(`[AI] Trying secondary: ${secondaryProvider}`);
//       const result = await (secondaryProvider === 'gemini' ? runGemini(prompt, safeHistory) : runOpenAI(prompt, safeHistory));
//       return result;
//     } catch (err2) {
//       console.error(`[AI] Secondary failed (${secondaryProvider}):`, err2.message);
//       return getSimulatedResponse(prompt);
//     }
//   }
// };

// async function runGemini(prompt, history) {
//   if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
//     throw new Error('Invalid Gemini Key');
//   }
//   try {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const chat = model.startChat({
//       history: history,
//       generationConfig: { maxOutputTokens: 1000 }
//     });
//     const result = await chat.sendMessage(prompt);
//     return result.response.text();
//   } catch (e) {
//     throw new Error(`Gemini Error: ${e.message}`);
//   }
// }

// async function runOpenAI(prompt, history) {
//   if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key' || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
//     throw new Error('Invalid OpenAI Key');
//   }

//   try {
//     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//     // Robust history formatting
//     const messages = history.map(item => {
//       if (!item || !item.parts || !item.parts[0]) return null;
//       return {
//         role: item.role === 'model' ? 'assistant' : 'user',
//         content: item.parts[0].text || ""
//       };
//     }).filter(m => m !== null);

//     messages.push({ role: 'user', content: prompt });

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: messages,
//       max_tokens: 1000,
//     });
//     return response.choices[0].message.content;
//   } catch (e) {
//     throw new Error(`OpenAI Error: ${e.message}`);
//   }
// }

// function getSimulatedResponse(prompt) {
//   console.log("[AI] FAIL-SAFE: Returning simulated response.");
//   const p = prompt.toLowerCase();

//   if (p.includes('hi') || p.includes('hello')) {
//     return "Hello! I'm NOVA, your adaptive AI companion. I'm currently running on my local backup neural core while my high-speed API links stabilize. How can I help you today?";
//   }

//   if (p.includes('code') || p.includes('function') || p.includes('bug') || p.includes('fix')) {
//     return "I've analyzed your request regarding code. As your Code Assistant, I recommend following modular design patterns and ensuring robust error handling. Since I'm in local-only mode, I can provide high-level guidance: always keep your functions pure and your components decoupled!";
//   }

//   if (p.includes('task') || p.includes('reminder')) {
//     return "I can certainly help you manage your productivity. You can use the Tasks and Reminders modules in the sidebar to organize your day. If you need any advice on prioritization, just ask!";
//   }

//   return "I've processed your input through my local logic core. While my advanced neural models are recalibrating, I can still assist with architecture and general questions. What's our next objective?";
// }






// const OpenAI = require("openai");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const BRAINS = require("./brainModels");

// exports.generateResponse = async ({
//   mode = "CHAT",
//   prompt,
//   history = []
// }) => {
//   const brain = BRAINS[mode] || BRAINS.CHAT;

//   // Prefer OpenAI for reasoning & code
//   if (process.env.OPENAI_API_KEY?.startsWith("sk-")) {
//     return runOpenAI(brain, prompt, history);
//   }

//   // Fallback Gemini Pro
//   if (process.env.GEMINI_API_KEY) {
//     return runGemini(brain, prompt);
//   }

//   return "NOVA is running in offline mode.";
// };

// async function runOpenAI(brain, prompt, history) {
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//   const messages = [
//     { role: "system", content: brain.systemPrompt },
//     ...history,
//     { role: "user", content: prompt }
//   ];

//   const res = await openai.chat.completions.create({
//     model: "gpt-4.1",
//     temperature: brain.temperature,
//     max_tokens: 1200,
//     messages
//   });

//   return res.choices[0].message.content;
// }

// async function runGemini(brain, prompt) {
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//   const result = await model.generateContent(`
// ${brain.systemPrompt}

// TASK:
// ${prompt}
//   `);

//   return result.response.text();
// }





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

