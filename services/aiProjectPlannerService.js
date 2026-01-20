const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

exports.generatePlan = async (projectIdea) => {
    try {
        const systemPrompt = `
You are an expert Technical Project Manager and Solution Architect.
Based on the user's project idea, generate a comprehensive implementation plan in Markdown format with the following sections:

1. 💻 **Tech Stack Suggestion**: specific frameworks, languages, and databases suitable for this project.
2. 📂 **Folder Structure**: A recommended directory tree (use valid tree syntax or indented list).
3. ⏱️ **Timeline**: Phased development timeline (MVP to Launch).
4. 💰 **Cost Estimation**: Rough estimate for infrastructure and development effort in Indian Rupees (₹). Use the '₹' symbol for ALL monetary values.

Be realistic and modern in your recommendations.
`.trim();

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Project Idea: ${projectIdea}` }
        ];

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.5,
            max_tokens: 2000,
        });

        return completion.choices[0].message.content;
    } catch (err) {
        console.error("AI PROJECT PLANNER ERROR:", err.message);
        throw new Error("Failed to generate project plan.");
    }
};
