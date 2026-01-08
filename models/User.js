const mongoose = require('mongoose');

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
    // User explicitly asked for NO hashing
    password: {
        type: String,
        required: true
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
