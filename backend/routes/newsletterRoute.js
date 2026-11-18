const express = require('express');
const {
    subscribeNewsletter,
    unsubscribeNewsletter
} = require('../controllers/newsletterController');

const newsletterRouter = express.Router();

newsletterRouter.post('/subscribe', subscribeNewsletter);
newsletterRouter.get('/unsubscribe', unsubscribeNewsletter);

module.exports = newsletterRouter;
