const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        default: null
    },
    profession: {
        type: String,
        enum: ['IT Professional', 'Student', 'HR / Manager', 'Freelancer', 'General User', 'Not Specified'],
        default: 'Not Specified'
    },
    onboarded: {
        type: Boolean,
        default: false
    },
    assistantName: {
        type: String,
        default: 'NOVA'
    },
    personality: {
        tone: {
            type: String,
            enum: ['Formal', 'Friendly', 'Motivational'],
            default: 'Friendly'
        },
        responseLength: {
            type: String,
            enum: ['Short', 'Medium', 'Long'],
            default: 'Medium'
        },
        language: {
            type: String,
            default: 'English'
        }
    },
    enabledSkills: [{
        type: String,
        enum: ['Task Management', 'Reminder System', 'Email/Report Generation', 'Code Assistance', 'Daily Summary']
    }],
    memorySettings: {
        storeHistory: {
            type: Boolean,
            default: true
        },
        retentionDays: {
            type: Number,
            default: 30
        }
    },
    bio: {
        type: String,
        default: 'Passionate about AI and productivity.'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // Check if password is hashed (bcrypt hashes start with $2a$ or $2b$)
    if (this.password.startsWith('$2')) {
        return await bcrypt.compare(enteredPassword, this.password);
    } else {
        // Fallback for legacy plain text passwords
        return this.password === enteredPassword;
    }
};

// Pre-save hook for email normalization
UserSchema.pre('save', async function () {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
});

module.exports = mongoose.model('User', UserSchema);
