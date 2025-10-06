const User = require('../models/User');
const jwt = require('jsonwebtoken');

// POST /auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone, address } = req.body;
        const user = await User.create({ name, email, password, role, phone, address });
        const token = user.generateJwtToken();
        res.status(201).json({
            success: true,
            user: user.getPublicProfile(),
            token
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// POST /auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        await user.updateLastLogin();

        const token = user.generateJwtToken();
        res.json({
            success: true,
            user: user.getPublicProfile(),
            token
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// GET /auth/me
exports.getMe = async (req, res) => {
    res.json({ success: true, user: req.user.getPublicProfile() });
};
