const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

// GET /api/employer/profile
router.get('/profile', auth, authorize('employer'), async (req, res) => {
  try {
    const [employers] = await db.query('SELECT * FROM employers WHERE user_id = ?', [req.user.id]);
    if (employers.length === 0) return res.status(404).json({ message: 'Employer profile not found.' });

    const employer = employers[0];

    // Get job stats
    const [stats] = await db.query(`
      SELECT
        COUNT(*) as total_jobs,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_jobs,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_jobs
      FROM jobs WHERE employer_id = ?
    `, [employer.id]);

    const [appStats] = await db.query(`
      SELECT COUNT(*) as total_applications
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.employer_id = ?
    `, [employer.id]);

    res.json({
      employer,
      stats: {
        ...stats[0],
        total_applications: appStats[0].total_applications
      }
    });
  } catch (error) {
    console.error('Get employer profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/employer/profile
router.put('/profile', auth, authorize('employer'), async (req, res) => {
  try {
    const { company_name, industry, website, description, location, company_size, founded_year } = req.body;

    await db.query(`
      UPDATE employers SET
        company_name = COALESCE(?, company_name),
        industry = COALESCE(?, industry),
        website = COALESCE(?, website),
        description = COALESCE(?, description),
        location = COALESCE(?, location),
        company_size = COALESCE(?, company_size),
        founded_year = COALESCE(?, founded_year)
      WHERE user_id = ?
    `, [company_name, industry, website, description, location, company_size, founded_year, req.user.id]);

    const [employers] = await db.query('SELECT * FROM employers WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Profile updated', employer: employers[0] });
  } catch (error) {
    console.error('Update employer profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/employer/jobs - Get employer's jobs
router.get('/jobs', auth, authorize('employer'), async (req, res) => {
  try {
    const [employers] = await db.query('SELECT id FROM employers WHERE user_id = ?', [req.user.id]);

    const [jobs] = await db.query(`
      SELECT j.*,
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as application_count,
        (SELECT GROUP_CONCAT(s.name SEPARATOR ', ')
         FROM job_skills js JOIN skills s ON js.skill_id = s.id
         WHERE js.job_id = j.id) as skills_list
      FROM jobs j
      WHERE j.employer_id = ?
      ORDER BY j.created_at DESC
    `, [employers[0].id]);

    res.json(jobs);
  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/employer/candidates - Search candidates
router.get('/candidates', auth, authorize('employer'), async (req, res) => {
  try {
    const { keyword, location, skill } = req.query;

    let query = `
      SELECT p.*, u.email,
        (SELECT GROUP_CONCAT(s.name SEPARATOR ', ')
         FROM profile_skills ps JOIN skills s ON ps.skill_id = s.id
         WHERE ps.profile_id = p.id) as skills_list
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE u.role = 'seeker' AND u.is_active = TRUE
    `;
    const params = [];

    if (keyword) {
      query += ` AND (p.full_name LIKE ? OR p.headline LIKE ? OR p.summary LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
    if (location) {
      query += ` AND p.location LIKE ?`;
      params.push(`%${location}%`);
    }
    if (skill) {
      query += ` AND p.id IN (
        SELECT ps.profile_id FROM profile_skills ps
        JOIN skills s ON ps.skill_id = s.id
        WHERE s.name LIKE ?
      )`;
      params.push(`%${skill}%`);
    }

    query += ' ORDER BY p.updated_at DESC LIMIT 50';
    const [candidates] = await db.query(query, params);

    res.json(candidates);
  } catch (error) {
    console.error('Search candidates error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
