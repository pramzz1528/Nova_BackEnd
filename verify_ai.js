const axios = require('axios');

async function testAI() {
    try {
        console.log("Testing AI API...");
        const res = await axios.post('https://nova-frontend-new.web.app/api/ai/chat', {
            message: "Hello, are you working?"
        });
        console.log("AI Response Status:", res.status);
        console.log("AI Reply:", res.data.reply);
        console.log("Model:", res.data.model);
    } catch (err) {
        console.error("AI Verification Failed:", err.message);
        if (err.response) {
            console.error("Response Data:", err.response.data);
            console.error("Response Status:", err.response.status);
        }
    }
}

testAI();
