const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const testEmail = `verify_login_${Date.now()}@example.com`;
        const testPassword = 'verifyPassword123';

        console.log(`1. Registering user: ${testEmail}`);
        const user = new User({
            username: `verify_${Date.now()}`,
            email: testEmail,
            password: testPassword
        });
        await user.save();
        console.log('User registered.');

        const savedUser = await User.findOne({ email: testEmail });
        const storedHash = savedUser.password;
        console.log(`Stored Password Hash: ${storedHash}`);

        if (!storedHash.startsWith('$2')) {
            console.error('❌ CRITICAL: Password was NOT hashed!');
        } else {
            console.log('✅ Hashing Check: PASSED');
        }

        console.log('2. Verifying Login (Correct Password)...');
        const isMatch = await savedUser.matchPassword(testPassword);
        if (isMatch) {
            console.log('✅ Login Verification: PASSED (Returns True)');
        } else {
            console.error('❌ Login Verification: FAILED (Returns False)');
        }

        console.log('3. Verifying Login (Wrong Password)...');
        const isMatchWrong = await savedUser.matchPassword('wrongpass');
        if (!isMatchWrong) {
            console.log('✅ Security Check: PASSED (Returns False for wrong password)');
        } else {
            console.error('❌ Security Check: FAILED (Returns True for wrong password!)');
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
