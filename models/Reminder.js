const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    repeat: {
        type: String,
        enum: ['None', 'Daily', 'Weekly'],
        default: 'None'
    },
    category: {
        type: String,
        default: 'General'
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
