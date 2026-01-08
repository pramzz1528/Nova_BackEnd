const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

/**
 * AI Service
 * Handles processing of messages with automatic fallback and fail-safe.
 */
exports.generateResponse = async (prompt, history = []) => {
    const primaryProvider = process.env.AI_PROVIDER || 'gemini';
    const secondaryProvider = primaryProvider === 'gemini' ? 'openai' : 'gemini';

    // Masked keys for logging
    const geminiMask = process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 5)}...` : 'MISSING';
    const openaiMask = process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 5)}...` : 'MISSING';

    console.log(`[AI] System Init: Gemini(${geminiMask}), OpenAI(${openaiMask}), Default(${primaryProvider})`);

    try {
        console.log(`[AI] Trying primary: ${primaryProvider}`);
        return await (primaryProvider === 'gemini' ? runGemini(prompt, history) : runOpenAI(prompt, history));
    } catch (err) {
        console.warn(`[AI] Primary failed (${primaryProvider}):`, err.message);
        try {
            console.log(`[AI] Trying secondary: ${secondaryProvider}`);
            return await (secondaryProvider === 'gemini' ? runGemini(prompt, history) : runOpenAI(prompt, history));
        } catch (err2) {
            console.error(`[AI] Secondary failed (${secondaryProvider}):`, err2.message);
            return getSimulatedResponse(prompt);
        }
    }
};

async function runGemini(prompt, history) {
    if (!process.env.GEMINI_API_KEY) throw new Error('No Gemini Key');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({ history, generationConfig: { maxOutputTokens: 1000 } });
    const result = await chat.sendMessage(prompt);
    return result.response.text();
}

async function runOpenAI(prompt, history) {
    if (!process.env.OPENAI_API_KEY) throw new Error('No OpenAI Key');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const messages = history.map(item => ({
        role: item.role === 'model' ? 'assistant' : item.role,
        content: item.parts[0].text
    }));
    messages.push({ role: 'user', content: prompt });

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 1000,
    });
    return response.choices[0].message.content;
}

function getSimulatedResponse(prompt) {
    console.log("[AI] FAIL-SAFE: Returning simulated response.");
    const p = prompt.toLowerCase();
    if (p.includes('hi') || p.includes('hello')) return "Hello there! I'm NOVA. My neural links are updating right now, but I'm still ready to help you with your tasks!";
    if (p.includes('code')) return "I see you're asking about code! My specialized coding module is fine-tuning its parameters at the moment. How else can I assist with your IT project?";
    return "I've received your message. I'm currently operating in power-saving mode while my API links stabilize. I'll be back at full capacity shortly!";
}
