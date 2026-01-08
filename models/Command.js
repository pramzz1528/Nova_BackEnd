const mongoose = require('mongoose');

const CommandSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trigger: {
        type: String,
        required: true
    },
    actions: [{
        type: {
            type: String, // e.g., 'create_task', 'set_reminder', 'generate_report'
            required: true
        },
        params: {
            type: mongoose.Schema.Types.Mixed
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Command', CommandSchema);
