const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v2: cloudinary } = require('cloudinary');
const crypto = require('crypto');
const User = require('../models/userModel');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../config/emailService');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        // Generate token
        const token = createToken(user._id);

        res.json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.json({ success: false, message: error.message });
    }
};

// User Register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profilePicture = '' } = req.body;

        // Check if user already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: 'User already exists' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePicture
        });

        const user = await newUser.save();

        // Generate token
        const token = createToken(user._id);

        // Send welcome email (optional - don't block on failure)
        sendWelcomeEmail(user.email, user.name).catch(err => 
            console.log('Welcome email failed:', err.message)
        );

        res.json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check credentials against environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            
            res.json({ 
                success: true, 
                token,
                user: {
                    email,
                    role: 'admin'
                }
            });
        } else {
            res.json({ success: false, message: 'Invalid admin credentials' });
        }

    } catch (error) {
        console.error('Admin Login Error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'No account found with this email' });
        }

        // Generate a 6-digit verification code
        const verificationCode = crypto.randomInt(100000, 1000000).toString();
        const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

        // Store only the hashed code for 10 minutes
        user.resetToken = hashedCode;
        user.resetTokenExpiry = Date.now() + 600000;
        await user.save();

        // Send password reset email
        try {
            await sendPasswordResetEmail(user.email, verificationCode, user.name);
            
            res.json({ 
                success: true, 
                message: 'Password reset instructions sent to your email'
            });
        } catch (emailError) {
            console.error('❌ Email sending failed!');
            console.error('Error name:', emailError.name);
            console.error('Error message:', emailError.message);
            console.error('Error stack:', emailError.stack);
            console.error('Full error object:', JSON.stringify(emailError, null, 2));

            // Do not leave an active reset code behind when no email was sent.
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();
            
            // Never expose the verification code or reset token
            res.json({ 
                success: false,
                message: 'Unable to send the verification code. Please try again.'
            });
        }

    } catch (error) {
        console.error('Password Reset Request Error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Reset Password with Token
const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        // Validate inputs
        if (!email || !resetToken || !newPassword) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }

        // Hash the submitted 6-digit code
        if (!/^\d{6}$/.test(resetToken)) {
            return res.json({ success: false, message: 'Verification code must be 6 digits' });
        }
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            email,
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired reset token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.json({ 
            success: true, 
            message: 'Password reset successful! You can now login with your new password.'
        });

    } catch (error) {
        console.error('Password Reset Error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get all users - Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } })
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, users });

    } catch (error) {
        console.error('Get All Users Error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get user statistics - Admin
const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const recentUsers = await User.find({ role: { $ne: 'admin' } })
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({ 
            success: true, 
            stats: {
                totalUsers,
                recentUsers
            }
        });

    } catch (error) {
        console.error('Get User Stats Error:', error);
        res.json({ success: false, message: error.message });
    }
};

const uploadProfilePicture = async (req, res) => {
   try {
       if (!req.file) {
           return res.json({ success: false, message: 'Profile picture is required' });
       }
       const result = await new Promise((resolve, reject) => {
           const stream = cloudinary.uploader.upload_stream(
               { folder: 'loomora/avatars', resource_type: 'image' },
               (error, upload) => error ? reject(error) : resolve(upload)
           );
           stream.end(req.file.buffer);
       });
       res.json({ success: true, url: result.secure_url });
   } catch (error) {
       res.json({ success: false, message: error.message });
   }
};

module.exports = { 
    loginUser, 
    registerUser, 
    adminLogin, 
    requestPasswordReset, 
    resetPassword,
    getAllUsers,
    getUserStats,
    uploadProfilePicture
};
