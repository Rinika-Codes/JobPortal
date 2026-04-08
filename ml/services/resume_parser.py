import re

# Common skills database for keyword matching
SKILLS_DB = {
    'programming': ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'php', 'typescript', 'scala', 'r'],
    'frontend': ['react', 'angular', 'vue.js', 'vue', 'svelte', 'html', 'css', 'html/css', 'sass', 'tailwind', 'bootstrap', 'jquery', 'next.js', 'nuxt'],
    'backend': ['node.js', 'express.js', 'express', 'django', 'flask', 'spring boot', 'spring', 'fastapi', 'rails', 'laravel', 'asp.net', 'rest api', 'graphql'],
    'database': ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server', 'cassandra', 'dynamodb', 'sql', 'nosql'],
    'cloud': ['aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'cloudflare'],
    'devops': ['docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'github actions', 'gitlab ci'],
    'data_science': ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'data analysis', 'nlp', 'computer vision'],
    'tools': ['git', 'github', 'gitlab', 'jira', 'confluence', 'figma', 'sketch', 'adobe xd', 'postman', 'vs code'],
    'design': ['ui/ux design', 'ui design', 'ux design', 'figma', 'graphic design', 'responsive design', 'wireframing', 'prototyping'],
    'management': ['agile', 'scrum', 'kanban', 'project management', 'product management', 'team leadership']
}

def parse_resume(text):
    """Parse resume text and extract skills, education, and experience."""
    if not text:
        return {'extracted_skills': [], 'sections': {}, 'parsed_by': 'ml_service'}

    text_lower = text.lower()

    # Extract skills
    found_skills = []
    for category, skills in SKILLS_DB.items():
        for skill in skills:
            if skill in text_lower:
                # Find the proper case version
                pattern = re.compile(re.escape(skill), re.IGNORECASE)
                match = pattern.search(text)
                if match:
                    found_skills.append({
                        'name': match.group(),
                        'category': category
                    })

    # Remove duplicates
    seen = set()
    unique_skills = []
    for s in found_skills:
        key = s['name'].lower()
        if key not in seen:
            seen.add(key)
            unique_skills.append(s)

    # Extract sections
    sections = {}

    # Education
    edu_pattern = r'(?:education|academic|qualification)[\s\S]*?(?=(?:experience|skills|projects|$))'
    edu_match = re.search(edu_pattern, text, re.IGNORECASE)
    if edu_match:
        sections['education'] = edu_match.group().strip()

    # Experience
    exp_pattern = r'(?:experience|work history|employment)[\s\S]*?(?=(?:education|skills|projects|$))'
    exp_match = re.search(exp_pattern, text, re.IGNORECASE)
    if exp_match:
        sections['experience'] = exp_match.group().strip()

    # Extract email
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)

    # Extract phone
    phone_pattern = r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,4}'
    phones = re.findall(phone_pattern, text)

    return {
        'extracted_skills': [s['name'] for s in unique_skills],
        'skills_with_categories': unique_skills,
        'contact': {
            'emails': emails[:1],
            'phones': phones[:1]
        },
        'sections': sections,
        'parsed_by': 'ml_service'
    }
