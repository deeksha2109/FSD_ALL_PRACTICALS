const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // basic validation
        if (!name || !email || !password) return res.status(400).json({ message: 'Please enter all fields' });
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });


        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);


        user = new User({ name, email, password: hashed });
        await user.save();


        const payload = { user: { id: user.id } };
        const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
        const token = jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });


        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ message: 'Please enter all fields' });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


        const payload = { user: { id: user.id } };
        const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
        const token = jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });


        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
