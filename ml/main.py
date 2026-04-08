from flask import Flask, request, jsonify
from flask_cors import CORS
from services.matching import calculate_match_score
from services.resume_parser import parse_resume
from services.llm_service import generate_cover_letter, analyze_skill_gap

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ml-service'})

@app.route('/match-score', methods=['POST'])
def match_score():
    try:
        data = request.get_json()
        user_skills = data.get('user_skills', [])
        job_skills = data.get('job_skills', [])
        job_description = data.get('job_description', '')

        result = calculate_match_score(user_skills, job_skills, job_description)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/cover-letter', methods=['POST'])
def cover_letter():
    try:
        data = request.get_json()
        profile = data.get('profile', {})
        skills = data.get('skills', [])
        experience = data.get('experience', [])
        job = data.get('job', {})

        result = generate_cover_letter(profile, skills, experience, job)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/skill-gap', methods=['POST'])
def skill_gap():
    try:
        data = request.get_json()
        user_skills = data.get('user_skills', [])
        job_skills = data.get('job_skills', [])

        result = analyze_skill_gap(user_skills, job_skills)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/parse-resume', methods=['POST'])
def parse_resume_endpoint():
    try:
        data = request.get_json()
        text = data.get('text', '')

        result = parse_resume(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
