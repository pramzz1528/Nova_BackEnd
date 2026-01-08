const mongoose = require('mongoose');

const AutomationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    triggerType: {
        type: String,
        enum: ['Time', 'Condition'],
        required: true
    },
    schedule: {
        type: String // Cron expression if triggerType is Time
    },
    condition: {
        type: String // Logic description or code snippet for Condition trigger
    },
    action: {
        type: {
            type: String,
            required: true
        },
        params: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    lastRun: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Automation', AutomationSchema);
