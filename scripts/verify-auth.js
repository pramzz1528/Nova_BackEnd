const mongoose = require('mongoose');
// Controller validation cannot be tested here since we are using Models directly.
// We rely on manual verification or API tests for controller logic.
const User = require('../models/User');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

const logFile = path.join(__dirname, '../verification_output.txt');
// Clear log file
if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const runVerification = async () => {
    log('Starting Verification...');

    // Connect to DB
    if (!process.env.MONGODB_URI) {
        log('MONGODB_URI is missing in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        log('MongoDB Connected');
    } catch (err) {
        log('MongoDB Connection Error: ' + err);
        process.exit(1);
    }

    try {
        // 1. Legacy Migration Verification (Manual DB manipulation)
        log('\n1. Legacy Migration Verification...');

        await User.deleteOne({ email: 'legacy@test.com' });

        // Insert plain text user (simulating old user)
        // We use insertOne to bypass Mongoose hooks if possible, or just create skipping hooks? 
        // new User + save() runs hooks. pre('save') runs.
        // We need to insert directly into collection to bypass the new pre-save hook that auto-hashes.
        await mongoose.connection.collection('users').insertOne({
            username: 'legacyuser',
            email: 'legacy@test.com',
            password: 'LegacyPassword123!',
            profession: 'Not Specified',
            enabledSkills: [],
            createdAt: new Date(),
            __v: 0
        });
        log('Legacy user inserted (raw) with plain text password.');

        // Verify it is plain text
        let legacyUser = await User.findOne({ email: 'legacy@test.com' });
        log(`Legacy Password (should be plain): ${legacyUser.password}`);

        // Simulate Login Controller Logic
        // The controller logic is:
        // 1. matchPassword(password)
        // 2. if match and !hashed -> markModified -> save

        const isMatchLegacy = await legacyUser.matchPassword('LegacyPassword123!');
        log(`Legacy Match check: ${isMatchLegacy ? 'PASS' : 'FAIL'}`);

        if (isMatchLegacy && !legacyUser.password.startsWith('$2')) {
            log('Triggering Auto-Migration...');
            legacyUser.markModified('password');
            await legacyUser.save();
        }

        // Re-fetch and verify hash
        legacyUser = await User.findOne({ email: 'legacy@test.com' });
        const isMigrated = legacyUser.password.startsWith('$2');
        log(`Post-Login Password: ${legacyUser.password}`);
        log(`Migration Verification: ${isMigrated ? 'PASS' : 'FAIL'}`);

        // Clean up
        await User.deleteOne({ email: 'legacy@test.com' });

        // 2. Standard Flow Verification
        log('\n2. Standard Flow Verification...');
        const testUserEmail = 'testverify@example.com';
        await User.deleteOne({ email: testUserEmail });

        const user = new User({
            username: 'testverify',
            email: testUserEmail,
            // Use a valid complex password
            password: 'StrongPassword123!'
        });
        await user.save();
        log('New user created.');

        const savedUser = await User.findOne({ email: testUserEmail });
        const isHashed = savedUser.password.startsWith('$2');
        log(`Hash Verification: ${isHashed ? 'PASS' : 'FAIL'}`);

        const isMatch = await savedUser.matchPassword('StrongPassword123!');
        log(`Login Match: ${isMatch ? 'PASS' : 'FAIL'}`);

        await User.deleteOne({ email: testUserEmail });

    } catch (err) {
        log('Verification Error: ' + err);
        console.error(err);
    } finally {
        await mongoose.disconnect();
        log('\nVerification Complete.');
    }
};

runVerification();
