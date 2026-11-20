const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables before importing routes and controllers.
dotenv.config();

const connectDB = require('./config/mongodb');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const orderRouter = require('./routes/orderRoute');
const feedbackRouter = require('./routes/feedbackRoute');
const newsletterRouter = require('./routes/newsletterRoute');

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, '');
const configuredOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || '').split(','),
]
    .map(normalizeOrigin)
    .filter(Boolean);

const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    ...configuredOrigins,
]);

connectDB();

app.use(express.json());
app.use(cors({
    origin(origin, callback) {
        // Requests without an Origin header include health checks and API clients.
        if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
            return callback(null, true);
        }

        const error = new Error('Origin is not allowed by CORS');
        error.status = 403;
        return callback(error);
    },
    credentials: true,
}));

app.use('/uploads', express.static('uploads'));

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/newsletter', newsletterRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
    console.log(`Allowed frontend origins: ${[...allowedOrigins].join(', ')}`);
});
