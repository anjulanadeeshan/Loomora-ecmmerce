const crypto = require('crypto');
const validator = require('validator');
const NewsletterSubscriber = require('../models/newsletterSubscriberModel');
const { sendNewsletterWelcomeEmail } = require('../config/emailService');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const subscribeNewsletter = async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address.'
        });
    }

    let subscriber;
    let isNewSubscriber = false;
    let previousState;

    try {
        subscriber = await NewsletterSubscriber.findOne({ email })
            .select('+unsubscribeTokenHash');

        if (subscriber?.status === 'active') {
            return res.json({
                success: true,
                alreadySubscribed: true,
                emailSent: false,
                message: 'This email is already on the Loomora list. No duplicate email was sent.'
            });
        }

        const unsubscribeToken = crypto.randomBytes(32).toString('hex');
        previousState = subscriber
            ? {
                status: subscriber.status,
                subscribedAt: subscriber.subscribedAt,
                unsubscribedAt: subscriber.unsubscribedAt,
                confirmationSentAt: subscriber.confirmationSentAt,
                unsubscribeTokenHash: subscriber.unsubscribeTokenHash
            }
            : null;

        if (!subscriber) {
            subscriber = new NewsletterSubscriber({ email });
            isNewSubscriber = true;
        }

        subscriber.status = 'pending';
        subscriber.unsubscribeTokenHash = hashToken(unsubscribeToken);
        subscriber.unsubscribedAt = null;
        await subscriber.save();

        const backendUrl = (process.env.BACKEND_URL || 'http://localhost:4000')
            .replace(/\/$/, '');
        const unsubscribeUrl = `${backendUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

        await sendNewsletterWelcomeEmail(email, unsubscribeUrl);

        subscriber.status = 'active';
        subscriber.subscribedAt = new Date();
        subscriber.confirmationSentAt = new Date();
        await subscriber.save();

        return res.status(isNewSubscriber ? 201 : 200).json({
            success: true,
            alreadySubscribed: false,
            emailSent: true,
            message: 'Welcome to the Loomora list. Please check your inbox.'
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error.message);

        if (subscriber) {
            if (isNewSubscriber) {
                await NewsletterSubscriber.deleteOne({ _id: subscriber._id }).catch(() => {});
            } else if (previousState) {
                Object.assign(subscriber, previousState);
                await subscriber.save().catch(() => {});
            }
        }

        if (error?.code === 11000) {
            return res.json({
                success: true,
                alreadySubscribed: true,
                emailSent: false,
                message: 'This email is already on the Loomora list. No duplicate email was sent.'
            });
        }

        return res.status(503).json({
            success: false,
            message: 'We could not complete your subscription. Please try again.'
        });
    }
};

const unsubscribeNewsletter = async (req, res) => {
    const token = String(req.query.token || '');

    if (!/^[a-f0-9]{64}$/i.test(token)) {
        return res.status(400).send('This unsubscribe link is invalid.');
    }

    try {
        const subscriber = await NewsletterSubscriber.findOne({
            unsubscribeTokenHash: hashToken(token)
        }).select('+unsubscribeTokenHash');

        if (!subscriber || subscriber.status === 'unsubscribed') {
            return res.send('This email is already unsubscribed from Loomora.');
        }

        subscriber.status = 'unsubscribed';
        subscriber.unsubscribedAt = new Date();
        await subscriber.save();

        return res.send('You have been unsubscribed from the Loomora list.');
    } catch (error) {
        console.error('Newsletter unsubscribe error:', error.message);
        return res.status(500).send('Unable to unsubscribe right now. Please try again.');
    }
};

module.exports = { subscribeNewsletter, unsubscribeNewsletter };
