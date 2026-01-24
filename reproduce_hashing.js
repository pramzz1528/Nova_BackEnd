const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const testEmail = `test_hashing_${Date.now()}@example.com`;
        const testPassword = 'mySecretPassword123';

        console.log(`Creating user with password: ${testPassword}`);

        const user = new User({
            username: `user_${Date.now()}`,
            email: testEmail,
            password: testPassword
        });

        await user.save();
        console.log('User saved.');

        // Fetch user directly from DB
        const savedUser = await User.findOne({ email: testEmail });
        console.log('Fetched User Password:', savedUser.password);

        if (savedUser.password === testPassword) {
            console.error('❌ FAIL: Password is stored in PLAIN TEXT!');
        } else if (savedUser.password.startsWith('$2')) {
            console.log('✅ SUCCESS: Password appears to be hashed.');
        } else {
            console.log('❓ UNKNOWN: Password is changed but format is unexpected:', savedUser.password);
        }

        await User.deleteOne({ email: testEmail });
        console.log('Cleanup done.');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
