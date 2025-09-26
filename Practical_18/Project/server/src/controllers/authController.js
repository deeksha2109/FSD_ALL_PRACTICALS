import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) => {
  const payload = { sub: user._id.toString(), email: user.email, isAdmin: user.isAdmin };
  const secret = process.env.JWT_SECRET || 'devsecret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email: email.toLowerCase(), phone, passwordHash });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password || '', user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

export const me = async (req, res) => {
  const u = req.user;
  res.json({ user: { id: u._id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, isAdmin: u.isAdmin } });
};

// Development-only: seed an admin user
export const seedAdmin = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not allowed in production' });
    }
    const { email, password, firstName = 'Admin', lastName = 'User' } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({ firstName, lastName, email: email.toLowerCase(), passwordHash, isAdmin: true });
    } else if (!user.isAdmin) {
      user.isAdmin = true;
      if (password) {
        user.passwordHash = await bcrypt.hash(password, 10);
      }
      await user.save();
    }
    const token = signToken(user);
    res.json({ token, user: { id: user._id, email: user.email, isAdmin: user.isAdmin } });
  } catch (e) {
    res.status(500).json({ message: 'Failed to seed admin' });
  }
};
