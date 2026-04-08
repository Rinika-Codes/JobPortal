const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/db');
const { auth } = require('../middleware/auth');

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// POST /api/ai/match-score
router.post('/match-score', auth, async (req, res) => {
  try {
    const { job_id } = req.body;

    // Get user skills
    const [profiles] = await db.query('SELECT id FROM profiles WHERE user_id = ?', [req.user.id]);
    if (profiles.length === 0) return res.status(404).json({ message: 'Profile not found.' });

    const [userSkills] = await db.query(`
      SELECT s.name, ps.proficiency_level
      FROM profile_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.profile_id = ?
    `, [profiles[0].id]);

    // Get job skills
    const [jobSkills] = await db.query(`
      SELECT s.name, js.importance
      FROM job_skills js
      JOIN skills s ON js.skill_id = s.id
      WHERE js.job_id = ?
    `, [job_id]);

    const [jobs] = await db.query('SELECT title, description FROM jobs WHERE id = ?', [job_id]);

    try {
      const response = await axios.post(`${ML_URL}/match-score`, {
        user_skills: userSkills,
        job_skills: jobSkills,
        job_description: jobs[0]?.description || ''
      }, { timeout: 5000 });
      res.json(response.data);
    } catch (mlError) {
      // Fallback: calculate locally
      const userSkillNames = userSkills.map(s => s.name.toLowerCase());
      const requiredSkills = jobSkills.filter(s => s.importance === 'required');
      const preferredSkills = jobSkills.filter(s => s.importance === 'preferred');

      const requiredMatch = requiredSkills.filter(s => userSkillNames.includes(s.name.toLowerCase()));
      const preferredMatch = preferredSkills.filter(s => userSkillNames.includes(s.name.toLowerCase()));

      const requiredScore = requiredSkills.length > 0 ? (requiredMatch.length / requiredSkills.length) * 70 : 70;
      const preferredScore = preferredSkills.length > 0 ? (preferredMatch.length / preferredSkills.length) * 30 : 30;
      const totalScore = Math.round(requiredScore + preferredScore);

      res.json({
        score: totalScore,
        matched_skills: [...requiredMatch, ...preferredMatch].map(s => s.name),
        missing_skills: jobSkills.filter(s => !userSkillNames.includes(s.name.toLowerCase())).map(s => s.name),
        breakdown: { required: Math.round(requiredScore), preferred: Math.round(preferredScore) }
      });
    }
  } catch (error) {
    console.error('Match score error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/ai/cover-letter
router.post('/cover-letter', auth, async (req, res) => {
  try {
    const { job_id } = req.body;

    const [profiles] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    if (profiles.length === 0) return res.status(404).json({ message: 'Profile not found.' });

    const [userSkills] = await db.query(`
      SELECT s.name FROM profile_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.profile_id = ?
    `, [profiles[0].id]);

    const [experience] = await db.query(
      'SELECT * FROM experience WHERE profile_id = ? ORDER BY is_current DESC LIMIT 2',
      [profiles[0].id]
    );

    const [jobs] = await db.query(`
      SELECT j.*, e.company_name FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      WHERE j.id = ?
    `, [job_id]);

    if (jobs.length === 0) return res.status(404).json({ message: 'Job not found.' });

    try {
      const response = await axios.post(`${ML_URL}/cover-letter`, {
        profile: profiles[0],
        skills: userSkills.map(s => s.name),
        experience,
        job: jobs[0]
      }, { timeout: 10000 });
      res.json(response.data);
    } catch (mlError) {
      // Fallback: template-based generation
      const profile = profiles[0];
      const job = jobs[0];
      const skills = userSkills.map(s => s.name);
      const latestExp = experience[0];

      const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company_name}. With my background in ${skills.slice(0, 3).join(', ')}${skills.length > 3 ? ` and ${skills.length - 3} other relevant technologies` : ''}, I am confident that I would be a valuable addition to your team.

${latestExp ? `In my ${latestExp.is_current ? 'current' : 'previous'} role as ${latestExp.title} at ${latestExp.company}, I have ${latestExp.description ? latestExp.description.substring(0, 200) : 'gained significant experience in the field'}. This experience has equipped me with the skills and knowledge needed to excel in this position.` : `My technical expertise and passion for ${job.industry || 'technology'} make me an ideal candidate for this role.`}

${profile.summary ? `${profile.summary.substring(0, 200)}` : 'I am a dedicated professional committed to delivering high-quality work and continuously improving my skills.'}

I am particularly excited about this opportunity because ${job.company_name} is known for ${job.description ? job.description.substring(0, 100) : 'its innovative approach'}. I believe my skills in ${skills.slice(0, 2).join(' and ')} align perfectly with your requirements.

I would welcome the opportunity to discuss how my experience and skills would benefit your team. Thank you for considering my application.

Best regards,
${profile.full_name}`;

      res.json({ cover_letter: coverLetter, generated_by: 'template' });
    }
  } catch (error) {
    console.error('Cover letter error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/ai/skill-gap
router.post('/skill-gap', auth, async (req, res) => {
  try {
    const { job_id } = req.body;

    const [profiles] = await db.query('SELECT id FROM profiles WHERE user_id = ?', [req.user.id]);
    if (profiles.length === 0) return res.status(404).json({ message: 'Profile not found.' });

    const [userSkills] = await db.query(`
      SELECT s.name, s.category, ps.proficiency_level
      FROM profile_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.profile_id = ?
    `, [profiles[0].id]);

    const [jobSkills] = await db.query(`
      SELECT s.name, s.category, js.importance
      FROM job_skills js
      JOIN skills s ON js.skill_id = s.id
      WHERE js.job_id = ?
    `, [job_id]);

    try {
      const response = await axios.post(`${ML_URL}/skill-gap`, {
        user_skills: userSkills,
        job_skills: jobSkills
      }, { timeout: 5000 });
      res.json(response.data);
    } catch (mlError) {
      // Fallback: local analysis
      const userSkillNames = userSkills.map(s => s.name.toLowerCase());

      const missing = jobSkills.filter(s => !userSkillNames.includes(s.name.toLowerCase()));
      const matched = jobSkills.filter(s => userSkillNames.includes(s.name.toLowerCase()));

      const recommendations = missing.map(skill => ({
        skill: skill.name,
        importance: skill.importance,
        category: skill.category,
        suggestion: `Consider learning ${skill.name} through online courses or hands-on projects. This is ${skill.importance === 'required' ? 'a critical requirement' : 'a nice-to-have skill'} for this position.`
      }));

      res.json({
        matched_skills: matched.map(s => ({ name: s.name, importance: s.importance })),
        missing_skills: missing.map(s => ({ name: s.name, importance: s.importance })),
        recommendations,
        coverage_percentage: jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0
      });
    }
  } catch (error) {
    console.error('Skill gap error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/ai/parse-resume
router.post('/parse-resume', auth, async (req, res) => {
  try {
    const { resume_text } = req.body;

    try {
      const response = await axios.post(`${ML_URL}/parse-resume`, {
        text: resume_text
      }, { timeout: 10000 });
      res.json(response.data);
    } catch (mlError) {
      // Fallback: keyword extraction
      const allSkills = ['JavaScript', 'Python', 'Java', 'React', 'Angular', 'Vue.js', 'Node.js',
        'Express.js', 'Django', 'Spring Boot', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
        'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML/CSS', 'TypeScript', 'Machine Learning',
        'Data Analysis', 'TensorFlow', 'SQL', 'REST API', 'GraphQL', 'Figma', 'UI/UX Design'];

      const foundSkills = allSkills.filter(skill =>
        resume_text.toLowerCase().includes(skill.toLowerCase())
      );

      res.json({
        extracted_skills: foundSkills,
        parsed_by: 'keyword_matching'
      });
    }
  } catch (error) {
    console.error('Parse resume error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
