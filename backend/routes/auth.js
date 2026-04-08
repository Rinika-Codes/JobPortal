const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { auth } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, full_name, company_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if user exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, password_hash, role || 'seeker']
    );

    const userId = result.insertId;

    // Create profile based on role
    if (role === 'employer') {
      await db.query(
        'INSERT INTO employers (user_id, company_name, industry, location) VALUES (?, ?, ?, ?)',
        [userId, company_name || 'My Company', 'Technology', '']
      );
    } else {
      await db.query(
        'INSERT INTO profiles (user_id, full_name) VALUES (?, ?)',
        [userId, full_name || 'New User']
      );
    }

    // Generate token
    const token = jwt.sign(
      { id: userId, email, role: role || 'seeker' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create welcome notification
    await db.query(
      'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
      [userId, 'system', 'Welcome to JobPortal!', 'Your account has been created successfully. Start exploring opportunities!']
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, email, role: role || 'seeker' }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, email, role, is_active, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];
    let profile = null;

    if (user.role === 'seeker') {
      const [profiles] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [user.id]);
      profile = profiles[0] || null;
    } else if (user.role === 'employer') {
      const [employers] = await db.query('SELECT * FROM employers WHERE user_id = ?', [user.id]);
      profile = employers[0] || null;
    }

    res.json({ user, profile });
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
