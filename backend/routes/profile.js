const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const { auth } = require('../middleware/auth');

// Multer config for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const uniqueName = `resume_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOC, DOCX files are allowed'));
  }
});

// GET /api/profile - Get current user profile
router.get('/', auth, async (req, res) => {
  try {
    const [profiles] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    const profile = profiles[0];

    // Get skills
    const [skills] = await db.query(`
      SELECT s.id, s.name, s.category, ps.proficiency_level
      FROM profile_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.profile_id = ?
      ORDER BY s.category, s.name
    `, [profile.id]);

    // Get education
    const [education] = await db.query(
      'SELECT * FROM education WHERE profile_id = ? ORDER BY end_date DESC',
      [profile.id]
    );

    // Get experience
    const [experience] = await db.query(
      'SELECT * FROM experience WHERE profile_id = ? ORDER BY is_current DESC, end_date DESC',
      [profile.id]
    );

    res.json({ profile, skills, education, experience });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/profile - Update profile
router.put('/', auth, async (req, res) => {
  try {
    const { full_name, headline, summary, location, phone, linkedin_url, github_url, portfolio_url } = req.body;

    await db.query(`
      UPDATE profiles SET
        full_name = COALESCE(?, full_name),
        headline = COALESCE(?, headline),
        summary = COALESCE(?, summary),
        location = COALESCE(?, location),
        phone = COALESCE(?, phone),
        linkedin_url = COALESCE(?, linkedin_url),
        github_url = COALESCE(?, github_url),
        portfolio_url = COALESCE(?, portfolio_url)
      WHERE user_id = ?
    `, [full_name, headline, summary, location, phone, linkedin_url, github_url, portfolio_url, req.user.id]);

    const [profiles] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Profile updated', profile: profiles[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/profile/resume - Upload resume
router.post('/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;
    await db.query('UPDATE profiles SET resume_url = ? WHERE user_id = ?', [resumeUrl, req.user.id]);

    res.json({ message: 'Resume uploaded successfully', resume_url: resumeUrl });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/profile/education - Add education
router.post('/education', auth, async (req, res) => {
  try {
    const { institution, degree, field_of_study, start_date, end_date, gpa, description } = req.body;
    const [profiles] = await db.query('SELECT id FROM profiles WHERE user_id = ?', [req.user.id]);
    if (profiles.length === 0) return res.status(404).json({ message: 'Profile not found.' });

    const [result] = await db.query(
      'INSERT INTO education (profile_id, institution, degree, field_of_study, start_date, end_date, gpa, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [profiles[0].id, institution, degree, field_of_study, start_date || null, end_date || null, gpa || null, description]
    );

    res.status(201).json({ message: 'Education added', id: result.insertId });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/profile/education/:id
router.delete('/education/:id', auth, async (req, res) => {
  try {
    const [profiles] = await db.query('SELECT id FROM profiles WHERE user_id = ?', [req.user.id]);
    await db.query('DELETE FROM education WHERE id = ? AND profile_id = ?', [req.params.id, profiles[0].id]);
    res.json({ message: 'Education deleted' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/profile/experience - Add experience
router.post('/experience', auth, async (req, res) => {
  try {
    const { company, title, location, start_date, end_date, is_current, description } = req.body;
    const [profiles] = await db.query('SELECT id FROM profiles WHERE user_id = ?', [req.user.id]);
    if (profiles.length === 0) return res.status(404).json({ message: 'Profile not found.' });

    const [result] = await db.query(
      'INSERT INTO experience (profile_id, company, title, location, start_date, end_date, is_current, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [profiles[0].id, company, title, location, start_date || null, end_date || null, is_current || false, description]
    );

    res.status(201).json({ message: 'Experience added', id: result.insertId });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/profile/experience/:id
router.delete('/experience/:id', auth, async (req, res) => {
  try {
    const [profiles] = await db.query('SELECT id FROM profiles WHERE user_id = ?', [req.user.id]);
    await db.query('DELETE FROM experience WHERE id = ? AND profile_id = ?', [req.params.id, profiles[0].id]);
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/profile/skills - Update skills
router.put('/skills', auth, async (req, res) => {
  try {
    const { skills } = req.body; // Array of { skill_id, proficiency_level }
    const [profiles] = await db.query('SELECT id FROM profiles WHERE user_id = ?', [req.user.id]);
    if (profiles.length === 0) return res.status(404).json({ message: 'Profile not found.' });

    const profileId = profiles[0].id;

    // Clear existing skills
    await db.query('DELETE FROM profile_skills WHERE profile_id = ?', [profileId]);

    // Add new skills
    if (skills && skills.length > 0) {
      const values = skills.map(s => [profileId, s.skill_id, s.proficiency_level || 'intermediate']);
      await db.query(
        'INSERT INTO profile_skills (profile_id, skill_id, proficiency_level) VALUES ?',
        [values]
      );
    }

    // Return updated skills
    const [updatedSkills] = await db.query(`
      SELECT s.id, s.name, s.category, ps.proficiency_level
      FROM profile_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.profile_id = ?
    `, [profileId]);

    res.json({ message: 'Skills updated', skills: updatedSkills });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/profile/skills/all - Get all available skills
router.get('/skills/all', auth, async (req, res) => {
  try {
    const [skills] = await db.query('SELECT * FROM skills ORDER BY category, name');
    res.json(skills);
  } catch (error) {
    console.error('Get all skills error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
