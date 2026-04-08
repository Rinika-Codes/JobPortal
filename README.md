# AI-Powered DBMS Job Portal

A full-stack, enterprise-grade job portal system enhanced with embedded machine learning capabilities. This application bridges the gap between job seekers and employers, offering intelligent analytical algorithms for resume parsing, cover letter generation, and targeted job-matching criteria.

## 🚀 Key Features

- **For Job Seekers**: Register customized profiles, upload resumes, track application status, and receive personalized skill-gap insights.
- **For Employers**: Maintain verified company landing pages, post job listings with required and "nice-to-have" skills, and instantly filter top candidates by match scores.
- **Dedicated AI/ML Engine**:
  - **Resume Parser Engine**: Automatically extracts structured technical skills and tools from unstructured plain text.
  - **Match Score Algorithm**: Calculates an aggregate relevancy metric (%) matching an applicant's `expert/intermediate` skills against a job's requirements.
  - **Skill-Gap Analysis**: Highlights precise missing skills and proposes actionable learning recommendations with estimated completion times.
  - **Cover Letter Generation**: Utilizes Natural Language Generation to draft professional letters tailored to combining the candidate's exact profile details with the target job context.
- **Real-Time Notification System**: In-app continuous alerts keeping users updated on application reviews and applicant activity.

## 🏗️ Architecture & Stack

- **Frontend**: React (Vite-optimized), TailwindCSS
- **Backend API**: Node.js & Express.js (RESTful endpoints, JWT Auth)
- **Machine Learning Microservice**: Python (Flask API, Scikit-Learn pipelines)
- **Database**: MySQL (Deep relational architectures enforcing structural integrity)

## 📊 Database Structure

The database manages 12 interconnected tables including lookup systems, linking tables for many-to-many complexities (like `job_skills` and `profile_skills`), and cascading relationship structures to handle robust query loads.

> 🖼️ **[View the complete E-R Diagram Architecture here](./ER_Diagram.png)**

## ⚙️ Local Setup & Execution

A master PowerShell script is provided to automatically initialize and spin up the 3 distinct microservices alongside executing schema migrations and seeds. 

1. Ensure MySQL is running locally on port `3306` with root access.
2. Form the project root, open your PowerShell terminal. 
3. Run the unified launcher script:
   ```powershell
   .\start_project.ps1
   ```
4. Three external shell sessions will securely boot the services on their designated ports (`5000`, `5001`, `5173`).
5. Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---
*Developed as a comprehensive Database Management System (DBMS) practical application, successfully prioritizing rigorous relational normalization alongside intelligent feature integrations.*
