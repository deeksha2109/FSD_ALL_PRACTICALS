const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Security
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:3000',
        'http://localhost:5173', // Vite default port
        'http://localhost:3000'  // React default port
    ],
    credentials: true,
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TownKart API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// Mount modular routes:
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));

// Error handling & 404
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 TownKart server running on port ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});

module.exports = app;
