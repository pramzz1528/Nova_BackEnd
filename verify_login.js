const mongoose = require('mongoose');
const User = require('./models/User');

const uri = "mongodb+srv://pramodkmadhavan46_db_user:pramod1123@novacluster.1iy3gtl.mongodb.net/nova?appName=Novacluster";

async function run() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(uri);
        console.log("Connected.");

        // 1. List all users (to see passwords) - be careful with logging
        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        if (users.length > 0) {
            const user = users[users.length - 1]; // Pick last user
            console.log("Testing with user:", user.email);
            console.log("Stored Password:", user.password); // Checking what's actually in DB

            // 2. Simulate correct login
            const validPass = user.password;
            if (validPass === user.password) {
                console.log("Test 1 (Valid Pass): MATCH (Expected)");
            } else {
                console.log("Test 1 (Valid Pass): NO MATCH (Unexpected)");
            }

            // 3. Simulate invalid login
            const invalidPass = "WRONG_PASSWORD_123";
            if (invalidPass !== user.password) {
                console.log("Test 2 (Invalid Pass): NO MATCH (Expected - Login should fail)");
            } else {
                console.log("Test 2 (Invalid Pass): MATCH (CRITICAL BUG - Login succeeds with wrong pass)");
            }

            // 4. Check logic from controller exactly
            // Controller: if (password !== user.password) -> Fail
            // We want to see if this condition is evaluating to FALSE (Success) for wrong password

            if (invalidPass !== user.password) {
                console.log("Controller Logic Check: Would return 400 'Invalid Credentials'");
            } else {
                console.log("Controller Logic Check: Would proceed (Login Bypass)");
            }
        } else {
            console.log("No users found to test.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
