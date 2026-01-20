const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

exports.analyzeCode = async (code) => {
    try {
        const systemPrompt = `
You are a Senior Software Architect and Code Reviewer.
Analyze the provided code and return a structured review in Markdown format with the following sections:

1. 🛡️ **Security Issues**: Potential vulnerabilities (SQLi, XSS, etc.) or "None detected" if safe.
2. ⚡ **Performance Warnings**: Inefficient loops, memory leaks, or heavy operations.
3. 📝 **Best Practice Suggestions**: Clean code, naming conventions, modularity.
4. 🔢 **Complexity Score**: Rate from 1 (Simple) to 10 (Complex) with a brief justification.

Format the output to be professional and encouraging.
`.trim();

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Review this code:\n\n${code}` }
        ];

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.3, // Lower temperature for analytical tasks
            max_tokens: 2000,
        });

        return completion.choices[0].message.content;
    } catch (err) {
        console.error("SMART CODE REVIEW ERROR:", err.message);
        throw new Error("Failed to generate code review.");
    }
};
