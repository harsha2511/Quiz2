from flask import Flask, jsonify, request
import PyPDF2
import requests
from io import BytesIO

app = Flask(__name__)

# Google Drive link to the PDF (use a publicly accessible link)
PDF_URL = "https://drive.google.com/file/d/1Qz0FM_Ic6ulm6Fzdma81Pbt3g1AM-j3S/view?usp=sharing"

def extract_questions_from_pdf(pdf_url):
    response = requests.get(pdf_url)
    if response.status_code != 200:
        return {"error": "Failed to download PDF"}, 500

    file_stream = BytesIO(response.content)
    pdf_reader = PyPDF2.PdfReader(file_stream)

    questions = []
    current_question = {}

    for page in pdf_reader.pages:
        text = page.extract_text()
        lines = text.split("\n")

        for line in lines:
            if line.strip().isdigit():  # Detect question numbers
                if current_question:
                    questions.append(current_question)
                current_question = {"question": line, "options": []}
            elif current_question and len(current_question["options"]) < 4:
                current_question["options"].append(line.strip())
    
    if current_question:  # Append the last question
        questions.append(current_question)

    return questions

@app.route('/get-questions', methods=['GET'])
def get_questions():
    try:
        questions = extract_questions_from_pdf(PDF_URL)
        return jsonify({"questions": questions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
