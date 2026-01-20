// const User = require('../models/User');
// const Memory = require('../models/Memory');
// const professionEngine = require('../services/professionEngine');
// const aiService = require('../services/aiService');

// // @route   POST api/ai/chat
// // @desc    Handle chat interaction with AI
// // @access  Private
// exports.chat = async (req, res) => {
//   const { message } = req.body;

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     // Get profession-based defaults for system prompt
//     const defaults = professionEngine.getDefaultsForProfession(user.profession);

//     // Check if Code Assistance is enabled
//     let skillContext = "";
//     const codeKeywords = ['code', 'review', 'optimization', 'bug', 'fix', 'refactor', 'function', 'class', 'javascript', 'python', 'java', 'html', 'css'];
//     const isCodeRequest = codeKeywords.some(keyword => message?.toLowerCase().includes(keyword));

//     if (isCodeRequest && user.enabledSkills?.includes('Code Assistance')) {
//       skillContext = "The user is asking for code assistance or review. Provide detailed feedback, check for bugs, and suggest optimizations.";
//     }

//     // Fetch last 5 interactions for context
//     let formattedHistory = [];
//     try {
//       const recentHistory = await Memory.find({ user: user.id }).sort({ createdAt: -1 }).limit(5);
//       formattedHistory = recentHistory.reverse().map(mem => {
//         const parts = mem.content.split(' | NOVA: ');
//         const userText = parts[0] ? parts[0].replace('User: ', '') : "Hello";
//         const modelText = parts[1] ? parts[1].replace('NOVA: ', '') : "I'm here to help!";

//         return [
//           { role: 'user', parts: [{ text: userText }] },
//           { role: 'model', parts: [{ text: modelText }] }
//         ];
//       }).flat();
//     } catch (e) {
//       console.warn('History fetch failed, continuing without context');
//     }

//     // Construct System Prompt
//     const tone = user.personality?.tone || 'professional';
//     const length = user.personality?.responseLength || 'balanced';
//     let systemPrompt = `${defaults.systemPrompt} Your tone is ${tone}. Your responses should be ${length}. ${skillContext}`;

//     const fullPrompt = `System Context: ${systemPrompt}\nUser says: ${message}`;

//     // Call AI Service
//     let botResponse;
//     try {
//       botResponse = await aiService.generateResponse(fullPrompt, formattedHistory);
//     } catch (err) {
//       console.error('CRITICAL: AI Service bypassed fallback:', err.message);
//       botResponse = "I'm having a bit of trouble connecting to my central brain, but I'm still here! What can I do for you?";
//     }

//     // Store in memory if enabled
//     if (user.memorySettings?.storeHistory) {
//       try {
//         const memory = new Memory({
//           user: user.id,
//           type: 'interaction',
//           content: `User: ${message} | NOVA: ${botResponse}`
//         });
//         await memory.save();
//       } catch (e) {
//         console.warn('Failed to save memory');
//       }
//     }

//     res.json({
//       response: botResponse,
//       reply: botResponse, // Added for frontend compatibility
//       assistantName: user.assistantName || 'NOVA',
//       model: "NOVA Brain"
//     });
//   } catch (err) {
//     console.error('AI Controller Error:', err.message);
//     res.status(500).json({ msg: 'AI processing failed', error: err.message });
//   }
// };

// // @route   POST api/ai/code-assistant
// // @desc    Handle specialized code assistance
// // @access  Private
// exports.codeAssistant = async (req, res) => {
//   const { message, language, codeContext } = req.body;

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     const systemPrompt = `You are NOVA's specialized Code Assistant. 
//         Your goal is to provide perfect, accurate, and professional code assistance for ${language || 'javascript'}.
//         Analyze the following:
//         1. Bug detection and logical errors.
//         2. Security vulnerabilities.
//         3. Performance optimizations.
//         4. Clean Code principles.

//         Current User Context: ${user.profession}.
//         Providing code snippets is highly encouraged.`;

//     const fullPrompt = `${systemPrompt}\n\nCode Context: ${codeContext || 'No context'}\n\nUser Question: ${message}`;

//     const botResponse = await aiService.generateResponse(fullPrompt, []);

//     res.json({
//       response: botResponse,
//       reply: botResponse, // Added for frontend compatibility
//       assistantName: user.assistantName || 'NOVA',
//       model: "NOVA Code Engine"
//     });
//   } catch (err) {
//     console.error('Code Assistant Error:', err.message);
//     res.status(500).json({ msg: 'Code processing failed', error: err.message });
//   }
// };

// // @route   GET api/ai/history
// // @desc    Get interaction memory
// // @access  Private
// exports.getHistory = async (req, res) => {
//   try {
//     const history = await Memory.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
//     res.json(history);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// // @route   POST api/ai/code-review
// // @desc    Handle code review
// // @access  Private
// exports.codeReview = async (req, res) => {
//   try {
//     const { code, language, mode } = req.body;

//     if (!code || !language || !mode) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const prompt = `Review the following ${language} code in ${mode} mode:\n\n${code}`;
//     const result = await aiService.generateResponse(prompt, []);

//     res.json({ result });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };






// const User = require('../models/User');
// const Memory = require('../models/Memory');
// const aiService = require('../services/aiService');
// const { buildPrompt } = require('../services/promptBuilder');

// exports.chat = async (req, res) => {
//   const { message } = req.body;

//   const reply = await aiService.generateResponse({
//     mode: "CHAT",
//     prompt: message
//   });

//   res.json({ reply, model: "NOVA Chat Brain" });
// };

// exports.codeReview = async (req, res) => {
//   const { code, language } = req.body;

//   const prompt = buildPrompt({
//     mode: "CODE_REVIEW",
//     language,
//     code
//   });

//   const reply = await aiService.generateResponse({
//     mode: "CODE_REVIEW",
//     prompt
//   });

//   res.json({ reply, model: "NOVA Code Review Brain" });
// };

// exports.codeAssistant = async (req, res) => {
//   const { code, language, message } = req.body;

//   const prompt = buildPrompt({
//     mode: "CODE_FIX",
//     language,
//     code,
//     message
//   });

//   const reply = await aiService.generateResponse({
//     mode: "CODE_FIX",
//     prompt
//   });

//   res.json({ reply, model: "NOVA Code Engine" });
// };



// const { chatWithGroq } = require("../services/groqservice");

// exports.chat = async (req, res) => {
//   try {
//     const { message, history = [] } = req.body;

//     const reply = await chatWithGroq({
//       message,
//       history
//     });

//     res.json({
//       reply,
//       model: "NOVA • LLaMA-3 (Groq)"
//     });
//   } catch (err) {
//     console.error("AI ERROR:", err.message);
//     res.status(500).json({
//       error: "AI service unavailable"
//     });
//   }
// };




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
