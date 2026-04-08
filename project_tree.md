# Project Tree Structure

```
JobPortal/
├── README.md
├── start_project.ps1
├── backend/
│   ├── init_db.js
│   ├── package.json
│   ├── server.js
│   ├── vercel.json
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── admin.js
│       ├── ai.js
│       ├── applications.js
│       ├── auth.js
│       ├── employer.js
│       ├── jobs.js
│       ├── notifications.js
│       └── profile.js
├── databases/
│   ├── migrations/
│   │   └── 001_schema.sql
│   └── seeds/
│   │   └── 001_seed.sql
├── frontend/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       │   ├── ai/
│       │   │   ├── CoverLetterGen.css
│       │   │   ├── CoverLetterGen.jsx
│       │   │   ├── MatchScore.css
│       │   │   ├── MatchScore.jsx
│       │   │   ├── SkillGap.css
│       │   │   └── SkillGap.jsx
│       │   ├── auth/
│       │   │   └── ProtectedRoute.jsx
│       │   ├── jobs/
│       │   │   ├── JobCard.css
│       │   │   ├── JobCard.jsx
│       │   │   ├── JobFilters.css
│       │   │   ├── JobFilters.jsx
│       │   │   ├── JobForm.css
│       │   │   └── JobForm.jsx
│       │   ├── profile/
│       │   │   ├── ResumeUpload.jsx
│       │   │   ├── SkillsInput.css
│       │   │   └── SkillsInput.jsx
│       │   └── shared/
│       │       ├── LoadingSpinner.css
│       │       ├── LoadingSpinner.jsx
│       │       ├── Navbar.css
│       │       ├── Navbar.jsx
│       │       ├── Notification.css
│       │       └── Notification.jsx
│       ├── hooks/
│       │   ├── useAuth.jsx
│       │   ├── useJobs.js
│       │   └── useNotifications.js
│       ├── pages/
│       │   ├── Admin.css
│       │   ├── Admin.jsx
│       │   ├── Applications.css
│       │   ├── Applications.jsx
│       │   ├── Auth.css
│       │   ├── Dashboard.css
│       │   ├── Dashboard.jsx
│       │   ├── Home.css
│       │   ├── Home.jsx
│       │   ├── JobDetail.css
│       │   ├── JobDetail.jsx
│       │   ├── JobSearch.jsx
│       │   ├── Login.jsx
│       │   ├── PostJob.jsx
│       │   ├── Profile.css
│       │   ├── Profile.jsx
│       │   └── Register.jsx
│       └── services/
│           ├── ai.service.js
│           ├── api.js
│           ├── auth.service.js
│           └── jobs.service.js
└── ml/
    ├── main.py
    ├── requirements.txt
    ├── models/
    └── services/
        ├── __init__.py
        ├── llm_service.py
        ├── matching.py
        └── resume_parser.py
```