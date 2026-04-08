from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_match_score(user_skills, job_skills, job_description=''):
    """
    Calculate match score between a candidate and a job posting.
    Uses skill matching + TF-IDF cosine similarity on descriptions.
    """

    user_skill_names = [s.get('name', '').lower() for s in user_skills if s.get('name')]
    job_skill_names = [s.get('name', '').lower() for s in job_skills if s.get('name')]

    if not job_skill_names:
        return {
            'score': 50,
            'matched_skills': [],
            'missing_skills': [],
            'breakdown': {'required': 0, 'preferred': 0, 'description': 50}
        }

    # Skill matching
    required_skills = [s for s in job_skills if s.get('importance') == 'required']
    preferred_skills = [s for s in job_skills if s.get('importance') == 'preferred']
    nice_to_have = [s for s in job_skills if s.get('importance') == 'nice-to-have']

    required_names = [s['name'].lower() for s in required_skills]
    preferred_names = [s['name'].lower() for s in preferred_skills]
    nice_names = [s['name'].lower() for s in nice_to_have]

    matched_required = [s for s in required_names if s in user_skill_names]
    matched_preferred = [s for s in preferred_names if s in user_skill_names]
    matched_nice = [s for s in nice_names if s in user_skill_names]

    # Weighted scoring
    required_score = (len(matched_required) / len(required_names) * 50) if required_names else 50
    preferred_score = (len(matched_preferred) / len(preferred_names) * 25) if preferred_names else 25
    nice_score = (len(matched_nice) / len(nice_names) * 10) if nice_names else 10

    # TF-IDF similarity for description matching
    desc_score = 0
    if job_description and user_skill_names:
        try:
            user_text = ' '.join(user_skill_names)
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([user_text, job_description])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            desc_score = similarity * 15
        except Exception:
            desc_score = 7.5

    total_score = min(round(required_score + preferred_score + nice_score + desc_score), 100)

    # Proficiency bonus
    proficiency_map = {'expert': 1.0, 'advanced': 0.8, 'intermediate': 0.6, 'beginner': 0.4}
    for skill in user_skills:
        if skill.get('name', '').lower() in required_names:
            bonus = proficiency_map.get(skill.get('proficiency_level', 'intermediate'), 0.6)
            total_score = min(total_score + bonus, 100)

    total_score = round(total_score)

    all_matched = list(set(matched_required + matched_preferred + matched_nice))
    all_missing = [s for s in job_skill_names if s not in user_skill_names]

    return {
        'score': total_score,
        'matched_skills': all_matched,
        'missing_skills': all_missing,
        'breakdown': {
            'required': round(required_score),
            'preferred': round(preferred_score),
            'description': round(desc_score)
        }
    }
