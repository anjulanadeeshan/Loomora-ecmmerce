const Feedback = require('../models/feedbackModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

const addFeedback = async (req, res) => {
    try {
        const { orderId, rating, message } = req.body;
        const userId = req.userId;
        const order = await Order.findOne({ _id: orderId, userId, status: 'Delivered' });

        if (!order) {
            return res.json({ success: false, message: 'Feedback is available only for delivered orders' });
        }

        const existing = await Feedback.findOne({ orderId, userId });
        if (existing) {
            return res.json({ success: false, message: 'Feedback has already been submitted for this order' });
        }

        const user = await User.findById(userId);
        const feedback = await Feedback.create({
            userId,
            orderId,
            name: user?.name || 'Loomora customer',
            profilePicture: user?.profilePicture || '',
            rating: Number(rating),
            message
        });

        res.json({ success: true, message: 'Feedback submitted for review', feedback });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const listApprovedFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(12);
        res.json({ success: true, feedback });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const listFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({}).sort({ createdAt: -1 });
        res.json({ success: true, feedback });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const updateFeedbackStatus = async (req, res) => {
    try {
        const { feedbackId, status } = req.body;
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.json({ success: false, message: 'Invalid feedback status' });
        }
        const feedback = await Feedback.findByIdAndUpdate(feedbackId, { status }, { new: true });
        res.json({ success: true, feedback });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const removeFeedback = async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.body.feedbackId);
        res.json({ success: true, message: 'Feedback removed' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

module.exports = { addFeedback, listApprovedFeedback, listFeedback, updateFeedbackStatus, removeFeedback };
