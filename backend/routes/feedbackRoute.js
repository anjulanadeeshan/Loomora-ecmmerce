const express = require('express');
const userAuth = require('../middleware/userAuth');
const adminAuth = require('../middleware/adminAuth');
const {
    addFeedback,
    listApprovedFeedback,
    listFeedback,
    updateFeedbackStatus,
    removeFeedback
} = require('../controllers/feedbackController');

const router = express.Router();

router.post('/add', userAuth, addFeedback);
router.get('/approved', listApprovedFeedback);
router.get('/list', adminAuth, listFeedback);
router.post('/status', adminAuth, updateFeedbackStatus);
router.post('/remove', adminAuth, removeFeedback);

module.exports = router;
