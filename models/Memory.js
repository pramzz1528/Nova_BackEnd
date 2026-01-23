const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['interaction', 'preference', 'fact'],
        default: 'interaction'
    },
    content: {
        type: String,
        required: true 
    },
    context: {
        type: mongoose.Schema.Types.Mixed // For storing additional metadata like skill involved
    },
    expiresAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Memory', MemorySchema);
