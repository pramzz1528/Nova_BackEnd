const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const aiService = require('../services/aiService');

async function test() {
    console.log("Testing aiService.js directly...");
    try {
        const response = await aiService.generateResponse("Hello, simple test.", []);
        console.log("Response:", response);
    } catch (error) {
        console.error("Failed:", error);
    }
}

test();
