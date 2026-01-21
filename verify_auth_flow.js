const mongoose = require('mongoose');
const User = require('./models/User');

const uri = "mongodb+srv://pramodkmadhavan46_db_user:pramod1123@novacluster.1iy3gtl.mongodb.net/nova?appName=Novacluster";

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected.");

        // Cleanup test user
        const testEmail = "test_verify_login@example.com";
        await User.findOneAndDelete({ email: testEmail });

        // 1. Register User
        console.log("Creating user...");
        const user = new User({
            username: "test_verify_user",
            email: testEmail,
            password: "correct_password"
        });
        await user.save();
        console.log("User created.");

        // 2. Refresh from DB
        const savedUser = await User.findOne({ email: testEmail });
        console.log("Stored Password:", savedUser.password);

        // 3. Test Logic
        const inputPasswordCorrect = "correct_password";
        const inputPasswordWrong = "WRONG_PASSWORD";

        // Correct
        if (inputPasswordCorrect === savedUser.password) {
            console.log("PASS: Correct password matches.");
        } else {
            console.log("FAIL: Correct password DOES NOT match.");
        }

        // Wrong
        if (inputPasswordWrong !== savedUser.password) {
            console.log("PASS: Wrong password detected (Logic Correct).");
        } else {
            console.log("FAIL: Wrong password MATCHES (Logic Broken).");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
run();
