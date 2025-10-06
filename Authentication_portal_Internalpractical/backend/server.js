require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const rateLimiter = require('./middleware/rateLimiter');


const app = express();
connectDB();


app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ type: ['application/json', 'text/plain', 'application/*+json'] }));
app.use(express.urlencoded({ extended: true }));

// Defensive: if body is a JSON string (e.g., sent as text/plain), parse it
app.use((req, res, next) => {
	if (typeof req.body === 'string') {
		try { req.body = JSON.parse(req.body); } catch (e) { /* ignore */ }
	}
	return next();
});

app.use(rateLimiter);

// Health check
app.get('/api/health', (req, res) => {
	return res.json({
		status: 'ok',
		db: mongoose.connection.readyState // 1 = connected
	});
});

app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));