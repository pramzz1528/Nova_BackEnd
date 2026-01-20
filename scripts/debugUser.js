const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const testUser = new User({
            username: 'debug_user_' + Date.now(),
            email: 'debug_user_' + Date.now() + '@example.com',
            password: 'password123'
        });

        console.log('Attempting to save user...');
        await testUser.save();
        console.log('User saved successfully');

    } catch (err) {
        console.error('Debug Script Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
