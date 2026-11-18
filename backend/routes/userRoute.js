const express = require('express');
const { loginUser, registerUser, adminLogin, requestPasswordReset, resetPassword, getAllUsers, getUserStats, uploadProfilePicture } = require('../controllers/userController');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/multer');

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/profile-upload', upload.single('profilePicture'), uploadProfilePicture);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/forgot-password', requestPasswordReset);
userRouter.post('/reset-password', resetPassword);

// Admin routes
userRouter.get('/list', adminAuth, getAllUsers);
userRouter.get('/stats', adminAuth, getUserStats);

module.exports = userRouter;
