const User = require('../models/User');
const Memory = require('../models/Memory');
const professionEngine = require('../services/professionEngine');
const aiService = require('../services/aiService');

// @route   POST api/ai/chat
// @desc    Handle chat interaction with AI
// @access  Private
exports.chat = async (req, res) => {
    const { message } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Get profession-based defaults for system prompt
        const defaults = professionEngine.getDefaultsForProfession(user.profession);

        // Check if Code Assistance is enabled and the user is asking about code
        let skillContext = "";
        const codeKeywords = ['code', 'review', 'optimization', 'bug', 'fix', 'refactor', 'function', 'class', 'javascript', 'python', 'java', 'html', 'css'];
        const isCodeRequest = codeKeywords.some(keyword => message.toLowerCase().includes(keyword));

        if (isCodeRequest && user.enabledSkills.includes('Code Assistance')) {
            skillContext = "The user is asking for code assistance or review. Provide detailed feedback, check for bugs, and suggest optimizations.";
        } else if (user.enabledSkills.includes('Email/Report Generation') && (message.toLowerCase().includes('email') || message.toLowerCase().includes('report'))) {
            skillContext = "The user is asking for email or report generation. Be professional and structured.";
        }

        // Fetch last 5 interactions for context
        const recentHistory = await Memory.find({ user: user.id }).sort({ createdAt: -1 }).limit(5);

        // Format history for AI provider (standardized in aiService)
        const formattedHistory = recentHistory.reverse().map(mem => {
            const parts = mem.content.split(' | NOVA: ');
            const userText = parts[0] ? parts[0].replace('User: ', '') : "Hello";
            const modelText = parts[1] ? parts[1].replace('NOVA: ', '') : "I'm here to help!";

            return [
                { role: 'user', parts: [{ text: userText }] },
                { role: 'model', parts: [{ text: modelText }] }
            ];
        }).flat();

        // Construct System Prompt
        let systemPrompt = `${defaults.systemPrompt} Your tone is ${user.personality.tone}. Your responses should be ${user.personality.responseLength}. ${skillContext}`;

        // Add additional context if it's a code review
        if (isCodeRequest && user.enabledSkills.includes('Code Assistance')) {
            systemPrompt += " When performing a code review, look for potential security issues, performance bottlenecks, and adherence to clean code principles.";
        }

        const fullPrompt = `System Context: ${systemPrompt}\nUser says: ${message}`;

        // Call AI Service (Now supports multiple providers and automatic fallback)
        let botResponse;
        try {
            botResponse = await aiService.generateResponse(fullPrompt, formattedHistory);
        } catch (err) {
            console.error('CRITICAL: AI Service bypassed fallback:', err.message);
            botResponse = "I'm having a bit of trouble connecting to my central brain, but I'm still here! What can I do for you?";
        }

        // Store in memory if enabled
        if (user.memorySettings.storeHistory) {
            const memory = new Memory({
                user: user.id,
                type: 'interaction',
                content: `User: ${message} | NOVA: ${botResponse}`
            });
            await memory.save();
        }

        res.json({
            response: botResponse,
            assistantName: user.assistantName
        });
    } catch (err) {
        console.error('AI Controller Error:', err.message);
        res.status(500).json({ msg: 'AI processing failed', error: err.message });
    }
};

// @route   GET api/ai/history
// @desc    Get interaction memory
// @access  Private
exports.getHistory = async (req, res) => {
    try {
        const history = await Memory.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
