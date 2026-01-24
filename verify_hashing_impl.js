const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const VERIFY_USER_EMAIL = 'verifyhashing@example.com';
const VERIFY_USER_PASS = 'P@ssw0rd123!'; // Meets complexity requirements

const runVerification = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        // Cleanup previous runs
        await User.deleteOne({ email: VERIFY_USER_EMAIL });

        console.log('Creating new user...');
        const user = new User({
            username: 'VerifyHashingUser',
            email: VERIFY_USER_EMAIL,
            password: VERIFY_USER_PASS // Plain text
        });

        console.log('Calling user.save()...');
        await user.save();
        console.log('User saved.');

        // Fetch user from DB to check raw password
        console.log('Fetching user...');
        const savedUser = await User.findOne({ email: VERIFY_USER_EMAIL });
        console.log('User fetched:', savedUser ? 'Found' : 'Not Found');

        if (!savedUser) {
            throw new Error('User was saved but could not be found!');
        }

        console.log('Verifying hashing...');
        console.log('Password type:', typeof savedUser.password);
        console.log('Password value:', savedUser.password);

        const isHashed = savedUser.password.startsWith('$2');
        console.log(`Password is hashed (starts with $2): ${isHashed}`);

        if (!isHashed) {
            throw new Error('Password was NOT hashed!');
        }

        console.log('Verifying matchPassword...');
        const isMatch = await savedUser.matchPassword(VERIFY_USER_PASS);
        console.log(`Password match result: ${isMatch}`);

        if (!isMatch) {
            throw new Error('Password match failed!');
        }

        console.log('Verifying incorrect password...');
        const isMatchWrong = await savedUser.matchPassword('WrongPass');
        console.log(`Incorrect password match result (should be false): ${isMatchWrong}`);

        if (isMatchWrong) {
            throw new Error('Incorrect password MATCHED (Security Risk)!');
        }

        console.log('VERIFICATION SUCCESSFUL: Password hashing works as expected.');

    } catch (err) {
        console.error('VERIFICATION FAILED:');
        console.error(err);
    } finally {
        console.log('Cleaning up...');
        try {
            await User.deleteOne({ email: VERIFY_USER_EMAIL });
        } catch (e) { console.error('Cleanup failed', e); }
        console.log('Disconnecting...');
        await mongoose.disconnect();
    }
};

runVerification();
