const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

// GET /api/jobs - List/search jobs
router.get('/', async (req, res) => {
  try {
    const { keyword, location, job_type, industry, salary_min, salary_max, sort, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT j.*, e.company_name, e.logo_url, e.industry as company_industry,
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as application_count,
        (SELECT GROUP_CONCAT(s.name SEPARATOR ', ')
         FROM job_skills js JOIN skills s ON js.skill_id = s.id
         WHERE js.job_id = j.id) as skills_list
      FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      WHERE j.status = 'active'
    `;

    const params = [];

    if (keyword) {
      query += ` AND (j.title LIKE ? OR j.description LIKE ? OR e.company_name LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
    if (location) {
      query += ` AND j.location LIKE ?`;
      params.push(`%${location}%`);
    }
    if (job_type) {
      query += ` AND j.job_type = ?`;
      params.push(job_type);
    }
    if (industry) {
      query += ` AND j.industry LIKE ?`;
      params.push(`%${industry}%`);
    }
    if (salary_min) {
      query += ` AND j.salary_max >= ?`;
      params.push(parseFloat(salary_min));
    }
    if (salary_max) {
      query += ` AND j.salary_min <= ?`;
      params.push(parseFloat(salary_max));
    }

    // Count total
    const countQuery = query.replace(/SELECT .+ FROM/, 'SELECT COUNT(*) as total FROM');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Sort
    switch (sort) {
      case 'salary_high': query += ' ORDER BY j.salary_max DESC'; break;
      case 'salary_low': query += ' ORDER BY j.salary_min ASC'; break;
      case 'oldest': query += ' ORDER BY j.created_at ASC'; break;
      default: query += ' ORDER BY j.created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [jobs] = await db.query(query, params);

    res.json({
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/jobs/:id - Get single job
router.get('/:id', async (req, res) => {
  try {
    const [jobs] = await db.query(`
      SELECT j.*, e.company_name, e.logo_url, e.description as company_description,
        e.website, e.location as company_location, e.company_size, e.industry as company_industry
      FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      WHERE j.id = ?
    `, [req.params.id]);

    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const job = jobs[0];

    // Get skills
    const [skills] = await db.query(`
      SELECT s.id, s.name, s.category, js.importance
      FROM job_skills js
      JOIN skills s ON js.skill_id = s.id
      WHERE js.job_id = ?
    `, [job.id]);

    // Increment view count
    await db.query('UPDATE jobs SET views_count = views_count + 1 WHERE id = ?', [job.id]);

    res.json({ job, skills });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/jobs - Create job (employer only)
router.post('/', auth, authorize('employer'), async (req, res) => {
  try {
    const {
      title, description, location, job_type, industry,
      salary_min, salary_max, qualifications, responsibilities,
      benefits, deadline, skills
    } = req.body;

    // Get employer id
    const [employers] = await db.query('SELECT id FROM employers WHERE user_id = ?', [req.user.id]);
    if (employers.length === 0) return res.status(404).json({ message: 'Employer profile not found.' });

    const [result] = await db.query(`
      INSERT INTO jobs (employer_id, title, description, location, job_type, industry,
        salary_min, salary_max, qualifications, responsibilities, benefits, deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [employers[0].id, title, description, location, job_type || 'full-time', industry,
        salary_min || null, salary_max || null, qualifications, responsibilities, benefits, deadline || null]);

    const jobId = result.insertId;

    // Add skills
    if (skills && skills.length > 0) {
      const values = skills.map(s => [jobId, s.skill_id, s.importance || 'required']);
      await db.query('INSERT INTO job_skills (job_id, skill_id, importance) VALUES ?', [values]);
    }

    res.status(201).json({ message: 'Job posted successfully', id: jobId });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/jobs/:id - Update job (employer only)
router.put('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    const {
      title, description, location, job_type, industry,
      salary_min, salary_max, qualifications, responsibilities,
      benefits, deadline, status, skills
    } = req.body;

    // Verify ownership
    const [employers] = await db.query('SELECT id FROM employers WHERE user_id = ?', [req.user.id]);
    const [jobs] = await db.query('SELECT id FROM jobs WHERE id = ? AND employer_id = ?', [req.params.id, employers[0].id]);
    if (jobs.length === 0) return res.status(403).json({ message: 'Not authorized to update this job.' });

    await db.query(`
      UPDATE jobs SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        location = COALESCE(?, location),
        job_type = COALESCE(?, job_type),
        industry = COALESCE(?, industry),
        salary_min = COALESCE(?, salary_min),
        salary_max = COALESCE(?, salary_max),
        qualifications = COALESCE(?, qualifications),
        responsibilities = COALESCE(?, responsibilities),
        benefits = COALESCE(?, benefits),
        deadline = COALESCE(?, deadline),
        status = COALESCE(?, status)
      WHERE id = ?
    `, [title, description, location, job_type, industry,
        salary_min, salary_max, qualifications, responsibilities,
        benefits, deadline, status, req.params.id]);

    // Update skills if provided
    if (skills) {
      await db.query('DELETE FROM job_skills WHERE job_id = ?', [req.params.id]);
      if (skills.length > 0) {
        const values = skills.map(s => [req.params.id, s.skill_id, s.importance || 'required']);
        await db.query('INSERT INTO job_skills (job_id, skill_id, importance) VALUES ?', [values]);
      }
    }

    res.json({ message: 'Job updated successfully' });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', auth, authorize('employer', 'admin'), async (req, res) => {
  try {
    if (req.user.role === 'employer') {
      const [employers] = await db.query('SELECT id FROM employers WHERE user_id = ?', [req.user.id]);
      const [jobs] = await db.query('SELECT id FROM jobs WHERE id = ? AND employer_id = ?', [req.params.id, employers[0].id]);
      if (jobs.length === 0) return res.status(403).json({ message: 'Not authorized.' });
    }

    await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/jobs/:id/save - Save/unsave job
router.post('/:id/save', auth, async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?',
      [req.user.id, req.params.id]
    );

    if (existing.length > 0) {
      await db.query('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?', [req.user.id, req.params.id]);
      res.json({ message: 'Job unsaved', saved: false });
    } else {
      await db.query('INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)', [req.user.id, req.params.id]);
      res.json({ message: 'Job saved', saved: true });
    }
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/jobs/saved/list - Get saved jobs
router.get('/saved/list', auth, async (req, res) => {
  try {
    const [savedJobs] = await db.query(`
      SELECT j.*, e.company_name, e.logo_url, sj.saved_at
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      JOIN employers e ON j.employer_id = e.id
      WHERE sj.user_id = ?
      ORDER BY sj.saved_at DESC
    `, [req.user.id]);

    res.json(savedJobs);
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
