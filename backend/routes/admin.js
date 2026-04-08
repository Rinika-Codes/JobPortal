const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [seekerCount] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'seeker'");
    const [employerCount] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'employer'");
    const [jobCount] = await db.query('SELECT COUNT(*) as count FROM jobs');
    const [activeJobCount] = await db.query("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'");
    const [applicationCount] = await db.query('SELECT COUNT(*) as count FROM applications');
    const [recentApps] = await db.query(`
      SELECT a.*, j.title as job_title, p.full_name as seeker_name, e.company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN employers e ON j.employer_id = e.id
      LEFT JOIN profiles p ON a.seeker_id = p.user_id
      ORDER BY a.applied_at DESC LIMIT 10
    `);

    // Application status breakdown
    const [statusBreakdown] = await db.query(`
      SELECT status, COUNT(*) as count FROM applications GROUP BY status
    `);

    // Top industries
    const [topIndustries] = await db.query(`
      SELECT industry, COUNT(*) as count FROM jobs
      WHERE industry IS NOT NULL
      GROUP BY industry ORDER BY count DESC LIMIT 5
    `);

    res.json({
      users: { total: userCount[0].count, seekers: seekerCount[0].count, employers: employerCount[0].count },
      jobs: { total: jobCount[0].count, active: activeJobCount[0].count },
      applications: { total: applicationCount[0].count, status_breakdown: statusBreakdown },
      top_industries: topIndustries,
      recent_applications: recentApps
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/users
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT u.id, u.email, u.role, u.is_active, u.created_at,
        COALESCE(p.full_name, e.company_name) as name
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN employers e ON u.id = e.user_id
      ORDER BY u.created_at DESC
    `);
    res.json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', auth, authorize('admin'), async (req, res) => {
  try {
    const { is_active } = req.body;
    await db.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active, req.params.id]);
    res.json({ message: `User ${is_active ? 'activated' : 'deactivated'}` });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
