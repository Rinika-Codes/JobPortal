-- ============================================
-- Job/Resume Posting Service - Seed Data
-- ============================================

USE job_portal;

-- ============================================
-- USERS (passwords are bcrypt hash of 'password123')
-- ============================================
INSERT INTO users (email, password_hash, role) VALUES
('admin@jobportal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('techcorp@employer.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employer'),
('innovate@employer.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employer'),
('john.doe@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seeker'),
('jane.smith@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seeker'),
('alex.kumar@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seeker');

-- ============================================
-- SKILLS (Master list)
-- ============================================
INSERT INTO skills (name, category) VALUES
('JavaScript', 'Programming'),
('Python', 'Programming'),
('Java', 'Programming'),
('React', 'Frontend'),
('Angular', 'Frontend'),
('Vue.js', 'Frontend'),
('Node.js', 'Backend'),
('Express.js', 'Backend'),
('Django', 'Backend'),
('Spring Boot', 'Backend'),
('MySQL', 'Database'),
('PostgreSQL', 'Database'),
('MongoDB', 'Database'),
('Redis', 'Database'),
('AWS', 'Cloud'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('Git', 'Tools'),
('HTML/CSS', 'Frontend'),
('TypeScript', 'Programming'),
('Machine Learning', 'Data Science'),
('Data Analysis', 'Data Science'),
('TensorFlow', 'Data Science'),
('SQL', 'Database'),
('REST API', 'Backend'),
('GraphQL', 'Backend'),
('Figma', 'Design'),
('UI/UX Design', 'Design'),
('Agile/Scrum', 'Management'),
('Project Management', 'Management');

-- ============================================
-- EMPLOYER PROFILES
-- ============================================
INSERT INTO employers (user_id, company_name, industry, website, description, location, company_size, founded_year) VALUES
(2, 'TechCorp Solutions', 'Technology', 'https://techcorp.example.com', 'A leading technology company specializing in enterprise software solutions, cloud computing, and AI-driven products. We build innovative tools that help businesses scale and transform digitally.', 'San Francisco, CA', '500-1000', 2012),
(3, 'InnovateLabs', 'Technology', 'https://innovatelabs.example.com', 'A cutting-edge startup focused on machine learning, NLP, and data-driven solutions. We are passionate about building products that make a real difference in people''s lives.', 'New York, NY', '50-200', 2019);

-- ============================================
-- SEEKER PROFILES
-- ============================================
INSERT INTO profiles (user_id, full_name, headline, summary, location, phone, linkedin_url, github_url) VALUES
(4, 'John Doe', 'Full Stack Developer | React & Node.js', 'Passionate full-stack developer with 3+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud technologies. Always eager to learn and contribute to impactful projects.', 'San Francisco, CA', '+1-555-0101', 'https://linkedin.com/in/johndoe', 'https://github.com/johndoe'),
(5, 'Jane Smith', 'Data Scientist | ML Engineer', 'Experienced data scientist with a strong background in machine learning, statistical modeling, and deep learning. Passionate about using data to drive business decisions and build intelligent systems.', 'New York, NY', '+1-555-0102', 'https://linkedin.com/in/janesmith', 'https://github.com/janesmith'),
(6, 'Alex Kumar', 'Frontend Developer | UI/UX Enthusiast', 'Creative frontend developer with expertise in React, Vue.js, and modern CSS frameworks. Strong eye for design and user experience. Looking for opportunities to build beautiful and intuitive interfaces.', 'Austin, TX', '+1-555-0103', 'https://linkedin.com/in/alexkumar', 'https://github.com/alexkumar');

-- ============================================
-- PROFILE SKILLS
-- ============================================
-- John Doe (user 4, profile 1)
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level) VALUES
(1, 1, 'expert'),      -- JavaScript
(1, 4, 'expert'),      -- React
(1, 7, 'advanced'),    -- Node.js
(1, 8, 'advanced'),    -- Express.js
(1, 11, 'advanced'),   -- MySQL
(1, 15, 'intermediate'), -- AWS
(1, 16, 'intermediate'), -- Docker
(1, 18, 'expert'),     -- Git
(1, 19, 'expert'),     -- HTML/CSS
(1, 20, 'advanced');    -- TypeScript

-- Jane Smith (user 5, profile 2)
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level) VALUES
(2, 2, 'expert'),      -- Python
(2, 21, 'expert'),     -- Machine Learning
(2, 22, 'expert'),     -- Data Analysis
(2, 23, 'advanced'),   -- TensorFlow
(2, 24, 'advanced'),   -- SQL
(2, 11, 'intermediate'), -- MySQL
(2, 16, 'intermediate'), -- Docker
(2, 18, 'advanced');    -- Git

-- Alex Kumar (user 6, profile 3)
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level) VALUES
(3, 1, 'advanced'),    -- JavaScript
(3, 4, 'expert'),      -- React
(3, 6, 'advanced'),    -- Vue.js
(3, 19, 'expert'),     -- HTML/CSS
(3, 20, 'advanced'),   -- TypeScript
(3, 27, 'advanced'),   -- Figma
(3, 28, 'advanced'),   -- UI/UX Design
(3, 18, 'expert');     -- Git

-- ============================================
-- EDUCATION
-- ============================================
INSERT INTO education (profile_id, institution, degree, field_of_study, start_date, end_date, gpa) VALUES
(1, 'Stanford University', 'Bachelor of Science', 'Computer Science', '2017-08-15', '2021-05-20', 3.80),
(2, 'MIT', 'Master of Science', 'Data Science', '2018-09-01', '2020-06-15', 3.90),
(2, 'UC Berkeley', 'Bachelor of Science', 'Statistics', '2014-08-20', '2018-05-15', 3.75),
(3, 'University of Texas at Austin', 'Bachelor of Science', 'Computer Science', '2019-08-20', '2023-05-15', 3.65);

-- ============================================
-- EXPERIENCE
-- ============================================
INSERT INTO experience (profile_id, company, title, location, start_date, end_date, is_current, description) VALUES
(1, 'StartupXYZ', 'Junior Full Stack Developer', 'San Francisco, CA', '2021-06-01', '2023-01-15', FALSE, 'Built and maintained React-based dashboard applications. Developed RESTful APIs using Node.js and Express. Managed MySQL databases and implemented caching with Redis.'),
(1, 'WebDev Agency', 'Full Stack Developer', 'San Francisco, CA', '2023-02-01', NULL, TRUE, 'Leading development of client-facing web applications using React and Node.js. Architecting microservices and implementing CI/CD pipelines. Mentoring junior developers.'),
(2, 'DataInsights Inc.', 'Data Scientist', 'New York, NY', '2020-07-01', NULL, TRUE, 'Developing machine learning models for customer churn prediction. Building NLP pipelines for text classification. Creating data visualization dashboards for stakeholder reporting.'),
(3, 'DesignStudio', 'Frontend Developer Intern', 'Austin, TX', '2022-06-01', '2022-12-31', FALSE, 'Developed responsive UI components using React and Vue.js. Collaborated with designers to implement pixel-perfect interfaces. Improved website performance by 40%.');

-- ============================================
-- JOB POSTINGS
-- ============================================
INSERT INTO jobs (employer_id, title, description, location, job_type, industry, salary_min, salary_max, qualifications, responsibilities, benefits, deadline, status) VALUES
(1, 'Senior React Developer', 
 'We are looking for an experienced React Developer to join our frontend team. You will be responsible for building and maintaining our customer-facing web applications, working closely with designers and backend engineers to deliver exceptional user experiences.',
 'San Francisco, CA', 'full-time', 'Technology', 120000.00, 180000.00,
 'Bachelor''s degree in Computer Science or related field. 3+ years of experience with React.js. Strong understanding of JavaScript/TypeScript. Experience with state management (Redux/Context). Familiarity with RESTful APIs and GraphQL.',
 'Build and maintain React-based web applications. Collaborate with UI/UX designers. Write clean, maintainable, and well-tested code. Participate in code reviews. Optimize application performance.',
 'Health, dental, and vision insurance. 401(k) with company match. Flexible work hours. Remote work options. Professional development budget.',
 '2026-06-30', 'active'),

(1, 'Backend Engineer (Node.js)',
 'Join our backend team to build scalable APIs and microservices. You will work on high-traffic systems serving millions of users, implementing robust backend architectures using Node.js and cloud technologies.',
 'San Francisco, CA', 'full-time', 'Technology', 130000.00, 190000.00,
 'Strong proficiency in Node.js and Express.js. Experience with SQL and NoSQL databases. Understanding of microservices architecture. Knowledge of Docker and Kubernetes. 4+ years of backend development experience.',
 'Design and implement RESTful APIs. Build and maintain microservices. Optimize database queries and performance. Implement security best practices. Collaborate with frontend engineers.',
 'Competitive salary and equity. Health benefits. Unlimited PTO. Learning stipend. Team offsite events.',
 '2026-07-15', 'active'),

(1, 'DevOps Engineer',
 'We''re seeking a DevOps Engineer to streamline our deployment pipeline and infrastructure. You''ll be responsible for automating processes, maintaining cloud infrastructure, and ensuring system reliability.',
 'Remote', 'remote', 'Technology', 140000.00, 200000.00,
 'Experience with AWS/GCP/Azure. Proficiency in Docker and Kubernetes. Knowledge of CI/CD tools (Jenkins, GitHub Actions). Scripting skills (Bash, Python). Understanding of monitoring tools (Prometheus, Grafana).',
 'Manage and optimize cloud infrastructure. Build and maintain CI/CD pipelines. Implement monitoring and alerting systems. Automate deployment processes. Ensure system security and compliance.',
 'Full remote work. Equipment stipend. Health benefits. Stock options. Flexible schedule.',
 '2026-08-01', 'active'),

(2, 'Machine Learning Engineer',
 'InnovateLabs is looking for a Machine Learning Engineer to develop and deploy ML models at scale. You will work on cutting-edge NLP and computer vision projects that impact millions of users.',
 'New York, NY', 'full-time', 'Technology', 150000.00, 220000.00,
 'Master''s or PhD in Computer Science, Statistics, or related field. 3+ years of experience in ML/DL. Proficiency in Python, TensorFlow/PyTorch. Experience with MLOps and model deployment. Strong mathematical and statistical skills.',
 'Develop and deploy machine learning models. Build data pipelines for model training. Collaborate with product teams on AI features. Research and implement state-of-the-art algorithms. Optimize model performance and scalability.',
 'Competitive compensation. Equity package. Health and wellness benefits. Conference attendance budget. Flexible work arrangement.',
 '2026-07-31', 'active'),

(2, 'Frontend Developer (React/Vue)',
 'We need a creative Frontend Developer to build beautiful, responsive interfaces for our data analytics platform. You''ll work closely with our design team to create polished user experiences.',
 'New York, NY', 'full-time', 'Technology', 100000.00, 150000.00,
 'Proficiency in React or Vue.js. Strong HTML/CSS skills. Experience with responsive design. Knowledge of UI/UX best practices. Familiarity with data visualization libraries.',
 'Build responsive and accessible web interfaces. Implement interactive data visualizations. Collaborate with designers and backend engineers. Write clean, well-documented code. Participate in design reviews.',
 'Health insurance. Gym membership. Flexible hours. Learning budget. Modern office space.',
 '2026-07-15', 'active'),

(2, 'Data Analyst Intern',
 'Join our data team as an intern and gain hands-on experience with real-world data analysis projects. You''ll learn from experienced data scientists and contribute to meaningful analytical work.',
 'New York, NY', 'internship', 'Technology', 30000.00, 45000.00,
 'Currently pursuing a degree in Statistics, Data Science, or related field. Basic knowledge of SQL and Python. Understanding of statistical concepts. Eagerness to learn and grow.',
 'Assist in data collection and cleaning. Perform exploratory data analysis. Create reports and visualizations. Support the data science team. Present findings to stakeholders.',
 'Paid internship. Mentorship program. Potential full-time offer. Networking opportunities. Free lunch.',
 '2026-06-15', 'active');

-- ============================================
-- JOB SKILLS
-- ============================================
-- Senior React Developer (job 1)
INSERT INTO job_skills (job_id, skill_id, importance) VALUES
(1, 4, 'required'),     -- React
(1, 1, 'required'),     -- JavaScript
(1, 20, 'required'),    -- TypeScript
(1, 19, 'required'),    -- HTML/CSS
(1, 25, 'preferred'),   -- REST API
(1, 26, 'nice-to-have'), -- GraphQL
(1, 18, 'required');    -- Git

-- Backend Engineer (job 2)
INSERT INTO job_skills (job_id, skill_id, importance) VALUES
(2, 7, 'required'),     -- Node.js
(2, 8, 'required'),     -- Express.js
(2, 1, 'required'),     -- JavaScript
(2, 11, 'required'),    -- MySQL
(2, 13, 'preferred'),   -- MongoDB
(2, 16, 'required'),    -- Docker
(2, 17, 'preferred'),   -- Kubernetes
(2, 25, 'required');    -- REST API

-- DevOps Engineer (job 3)
INSERT INTO job_skills (job_id, skill_id, importance) VALUES
(3, 15, 'required'),    -- AWS
(3, 16, 'required'),    -- Docker
(3, 17, 'required'),    -- Kubernetes
(3, 2, 'preferred'),    -- Python
(3, 18, 'required');    -- Git

-- ML Engineer (job 4)
INSERT INTO job_skills (job_id, skill_id, importance) VALUES
(4, 2, 'required'),     -- Python
(4, 21, 'required'),    -- Machine Learning
(4, 23, 'required'),    -- TensorFlow
(4, 22, 'required'),    -- Data Analysis
(4, 16, 'preferred'),   -- Docker
(4, 24, 'preferred');   -- SQL

-- Frontend Developer React/Vue (job 5)
INSERT INTO job_skills (job_id, skill_id, importance) VALUES
(5, 4, 'required'),     -- React
(5, 6, 'preferred'),    -- Vue.js
(5, 1, 'required'),     -- JavaScript
(5, 19, 'required'),    -- HTML/CSS
(5, 28, 'preferred'),   -- UI/UX Design
(5, 27, 'nice-to-have'); -- Figma

-- Data Analyst Intern (job 6)
INSERT INTO job_skills (job_id, skill_id, importance) VALUES
(6, 24, 'required'),    -- SQL
(6, 2, 'preferred'),    -- Python
(6, 22, 'required');    -- Data Analysis

-- ============================================
-- APPLICATIONS
-- ============================================
INSERT INTO applications (job_id, seeker_id, status, cover_letter, match_score) VALUES
(1, 4, 'shortlisted', 'I am excited to apply for the Senior React Developer position at TechCorp Solutions. With over 3 years of experience building React applications and a strong foundation in JavaScript/TypeScript, I believe I would be a valuable addition to your frontend team. My current role involves leading development of client-facing web applications, and I am eager to bring this experience to your organization.', 85.50),
(4, 5, 'reviewed', 'I am writing to express my interest in the Machine Learning Engineer position at InnovateLabs. With my Master''s degree in Data Science from MIT and hands-on experience developing ML models for production environments, I am well-suited for this role. I am particularly excited about working on NLP and computer vision projects at scale.', 92.00),
(5, 6, 'pending', 'I would love to join InnovateLabs as a Frontend Developer. My expertise in React and Vue.js, combined with a strong eye for design, makes me an ideal candidate. I have experience building responsive, accessible interfaces and am passionate about creating exceptional user experiences.', 78.00);

-- ============================================
-- NOTIFICATIONS
-- ============================================
INSERT INTO notifications (user_id, type, title, message, is_read, reference_id, reference_type) VALUES
(4, 'application_update', 'Application Shortlisted!', 'Your application for "Senior React Developer" at TechCorp Solutions has been shortlisted. The employer will contact you soon for the next steps.', FALSE, 1, 'application'),
(5, 'application_update', 'Application Reviewed', 'Your application for "Machine Learning Engineer" at InnovateLabs is being reviewed by the hiring team.', FALSE, 2, 'application'),
(2, 'new_application', 'New Application Received', 'John Doe has applied for the "Senior React Developer" position.', TRUE, 1, 'application'),
(3, 'new_application', 'New Application Received', 'Jane Smith has applied for the "Machine Learning Engineer" position.', FALSE, 2, 'application'),
(3, 'new_application', 'New Application Received', 'Alex Kumar has applied for the "Frontend Developer (React/Vue)" position.', FALSE, 3, 'application');

-- ============================================
-- SAVED JOBS
-- ============================================
INSERT INTO saved_jobs (user_id, job_id) VALUES
(4, 2),
(4, 3),
(5, 4),
(6, 1),
(6, 5);
