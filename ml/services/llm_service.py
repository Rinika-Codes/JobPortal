import random


def generate_cover_letter(profile, skills, experience, job):
    """Generate a professional cover letter using template-based NLG."""

    name = profile.get('full_name', 'Applicant')
    headline = profile.get('headline', '')
    summary = profile.get('summary', '')
    job_title = job.get('title', 'the position')
    company = job.get('company_name', 'your company')
    job_desc = job.get('description', '')
    industry = job.get('industry', 'technology')

    skills_str = ', '.join(skills[:4]) if skills else 'various technologies'
    remaining = len(skills) - 4 if len(skills) > 4 else 0

    # Get latest experience
    latest_exp = experience[0] if experience else None

    # Opening variations
    openings = [
        f"I am thrilled to apply for the {job_title} position at {company}.",
        f"I am writing to express my enthusiastic interest in the {job_title} role at {company}.",
        f"With great excitement, I submit my application for the {job_title} position at {company}.",
    ]

    # Body based on experience
    if latest_exp:
        exp_title = latest_exp.get('title', 'developer')
        exp_company = latest_exp.get('company', 'my previous company')
        exp_desc = latest_exp.get('description', '')
        is_current = latest_exp.get('is_current', False)

        exp_paragraph = (
            f"{'Currently' if is_current else 'Previously'}, I {'serve' if is_current else 'served'} as "
            f"{exp_title} at {exp_company}, where I have honed my expertise in {skills_str}. "
            f"{exp_desc[:200] + '...' if len(exp_desc) > 200 else exp_desc}"
        )
    else:
        exp_paragraph = (
            f"Through my academic and professional journey, I have developed strong expertise in "
            f"{skills_str}. I am passionate about applying these skills to create meaningful impact."
        )

    # Skills paragraph
    skills_paragraph = (
        f"My technical proficiency spans {skills_str}"
        f"{f', along with {remaining} additional relevant technologies' if remaining > 0 else ''}. "
        f"I am confident that this diverse skill set aligns well with your requirements and would enable "
        f"me to make significant contributions to your team from day one."
    )

    # Motivation paragraph
    motivation = (
        f"What excites me most about {company} is the opportunity to work on "
        f"{'cutting-edge projects in ' + industry if industry else 'innovative and impactful projects'}. "
        f"I am drawn to your company's vision and believe that my background in {skills[:2][0] if skills else 'technology'} "
        f"and passion for excellence make me an ideal fit for this role."
    )

    # Closing
    closing = (
        f"I would welcome the opportunity to discuss how my skills and experience align with your needs. "
        f"Thank you for considering my application. I look forward to the possibility of contributing "
        f"to {company}'s continued success."
    )

    cover_letter = f"""Dear Hiring Manager,

{random.choice(openings)}

{exp_paragraph}

{skills_paragraph}

{motivation}

{closing}

Warm regards,
{name}"""

    return {
        'cover_letter': cover_letter,
        'generated_by': 'ml_service',
        'word_count': len(cover_letter.split())
    }


def analyze_skill_gap(user_skills, job_skills):
    """Analyze the gap between user skills and job requirements."""

    user_skill_names = [s.get('name', '').lower() for s in user_skills]
    user_skill_map = {s.get('name', '').lower(): s for s in user_skills}

    matched = []
    missing = []

    for js in job_skills:
        skill_name = js.get('name', '').lower()
        importance = js.get('importance', 'required')

        if skill_name in user_skill_names:
            user_s = user_skill_map[skill_name]
            matched.append({
                'name': js['name'],
                'importance': importance,
                'proficiency': user_s.get('proficiency_level', 'intermediate'),
                'category': js.get('category', 'Other')
            })
        else:
            missing.append({
                'name': js['name'],
                'importance': importance,
                'category': js.get('category', 'Other')
            })

    # Generate learning recommendations
    learning_resources = {
        'programming': 'Practice on LeetCode, HackerRank, or build personal projects',
        'frontend': 'Build responsive web apps and explore component libraries',
        'backend': 'Create REST APIs and explore microservices architecture',
        'database': 'Take database courses on Coursera and practice with real datasets',
        'cloud': 'Get certified through AWS/Azure/GCP free tier programs',
        'devops': 'Set up CI/CD pipelines for personal projects using GitHub Actions',
        'data_science': 'Complete Kaggle competitions and study ML fundamentals',
        'tools': 'Integrate into your daily workflow through personal projects',
        'design': 'Study design principles and practice with Figma tutorials',
        'management': 'Lead team projects and get Scrum/Agile certifications'
    }

    recommendations = []
    for skill in missing:
        category = skill.get('category', 'Other').lower().replace(' ', '_')
        suggestion = learning_resources.get(category, 'Explore online courses and hands-on projects')

        priority = 'high' if skill['importance'] == 'required' else ('medium' if skill['importance'] == 'preferred' else 'low')

        recommendations.append({
            'skill': skill['name'],
            'importance': skill['importance'],
            'priority': priority,
            'category': skill.get('category', 'Other'),
            'suggestion': f"Learn {skill['name']}: {suggestion}",
            'estimated_time': '2-4 weeks' if priority == 'high' else '1-2 weeks'
        })

    # Sort recommendations by priority
    priority_order = {'high': 0, 'medium': 1, 'low': 2}
    recommendations.sort(key=lambda x: priority_order.get(x['priority'], 3))

    coverage = round((len(matched) / len(job_skills) * 100)) if job_skills else 100

    return {
        'matched_skills': matched,
        'missing_skills': [{'name': s['name'], 'importance': s['importance']} for s in missing],
        'recommendations': recommendations,
        'coverage_percentage': coverage,
        'analysis_summary': f"You match {len(matched)} out of {len(job_skills)} required skills ({coverage}% coverage)."
    }
