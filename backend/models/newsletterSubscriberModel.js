const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'unsubscribed'],
        default: 'pending'
    },
    subscribedAt: {
        type: Date,
        default: null
    },
    unsubscribedAt: {
        type: Date,
        default: null
    },
    confirmationSentAt: {
        type: Date,
        default: null
    },
    unsubscribeTokenHash: {
        type: String,
        required: true,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.models.newsletterSubscriber
    || mongoose.model('newsletterSubscriber', newsletterSubscriberSchema);
