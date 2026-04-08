const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

// POST /api/applications - Apply for a job
router.post('/', auth, authorize('seeker'), async (req, res) => {
  try {
    const { job_id, cover_letter } = req.body;

    // Check if job exists and is active
    const [jobs] = await db.query('SELECT * FROM jobs WHERE id = ? AND status = ?', [job_id, 'active']);
    if (jobs.length === 0) return res.status(404).json({ message: 'Job not found or closed.' });

    // Check if already applied
    const [existing] = await db.query(
      'SELECT id FROM applications WHERE job_id = ? AND seeker_id = ?',
      [job_id, req.user.id]
    );
    if (existing.length > 0) return res.status(409).json({ message: 'You have already applied for this job.' });

    // Create application
    const [result] = await db.query(
      'INSERT INTO applications (job_id, seeker_id, cover_letter) VALUES (?, ?, ?)',
      [job_id, req.user.id, cover_letter || null]
    );

    // Notify employer
    const job = jobs[0];
    const [employers] = await db.query('SELECT user_id, company_name FROM employers WHERE id = ?', [job.employer_id]);
    const [profiles] = await db.query('SELECT full_name FROM profiles WHERE user_id = ?', [req.user.id]);
    const seekerName = profiles[0]?.full_name || 'A candidate';

    await db.query(
      'INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, ?, ?, ?, ?, ?)',
      [employers[0].user_id, 'new_application', 'New Application Received',
       `${seekerName} has applied for "${job.title}".`, result.insertId, 'application']
    );

    res.status(201).json({ message: 'Application submitted successfully', id: result.insertId });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/applications - Get my applications (seeker)
router.get('/', auth, authorize('seeker'), async (req, res) => {
  try {
    const [applications] = await db.query(`
      SELECT a.*, j.title as job_title, j.location as job_location, j.job_type,
        j.salary_min, j.salary_max, e.company_name, e.logo_url
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN employers e ON j.employer_id = e.id
      WHERE a.seeker_id = ?
      ORDER BY a.applied_at DESC
    `, [req.user.id]);

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/applications/job/:jobId - Get applications for a job (employer)
router.get('/job/:jobId', auth, authorize('employer'), async (req, res) => {
  try {
    // Verify employer owns this job
    const [employers] = await db.query('SELECT id FROM employers WHERE user_id = ?', [req.user.id]);
    const [jobs] = await db.query('SELECT id FROM jobs WHERE id = ? AND employer_id = ?', [req.params.jobId, employers[0].id]);
    if (jobs.length === 0) return res.status(403).json({ message: 'Not authorized.' });

    const [applications] = await db.query(`
      SELECT a.*, p.full_name, p.headline, p.location as seeker_location,
        p.resume_url, p.avatar_url, u.email,
        (SELECT GROUP_CONCAT(s.name SEPARATOR ', ')
         FROM profile_skills ps JOIN skills s ON ps.skill_id = s.id
         WHERE ps.profile_id = p.id) as skills_list
      FROM applications a
      JOIN users u ON a.seeker_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE a.job_id = ?
      ORDER BY a.applied_at DESC
    `, [req.params.jobId]);

    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/applications/:id/status - Update application status (employer)
router.put('/:id/status', auth, authorize('employer'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    // Verify ownership
    const [applications] = await db.query(`
      SELECT a.*, j.title as job_title, j.employer_id
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `, [req.params.id]);

    if (applications.length === 0) return res.status(404).json({ message: 'Application not found.' });

    const app = applications[0];
    const [employers] = await db.query('SELECT id FROM employers WHERE user_id = ?', [req.user.id]);
    if (app.employer_id !== employers[0].id) return res.status(403).json({ message: 'Not authorized.' });

    await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);

    // Notify seeker
    const statusMessages = {
      reviewed: 'is being reviewed',
      shortlisted: 'has been shortlisted! 🎉',
      rejected: 'was not selected at this time',
      accepted: 'has been accepted! Congratulations! 🎉'
    };

    if (statusMessages[status]) {
      await db.query(
        'INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, ?, ?, ?, ?, ?)',
        [app.seeker_id, 'application_update', `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
         `Your application for "${app.job_title}" ${statusMessages[status]}.`, app.id, 'application']
      );
    }

    res.json({ message: 'Application status updated' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
