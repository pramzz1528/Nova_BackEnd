const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createUser = async (username, email, password) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists');
            process.exit();
        }

        user = new User({
            username,
            email,
            password // Storing as plain text per user request
        });

        await user.save();
        console.log(`User ${username} created successfully!`);
        process.exit();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('Usage: node scripts/createUser.js <username> <email> <password>');
    process.exit(1);
}

createUser(args[0], args[1], args[2]);
