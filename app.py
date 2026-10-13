from flask import Flask, request, jsonify, send_from_directory, render_template
from pathlib import Path

print("FraudGenome AI is starting...")

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent


@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")
@app.route("/speech-page")
def speech_page():
    return render_template("speech.html")

@app.route("/analyze-page")
def analyze_page():
    return render_template("analyze.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    message = request.form.get("message", "").strip()

    if not message:
        return render_template(
            "analyze.html",
            message="",
            risk="Unknown",
            findings=[],
            result="Please enter a message to analyze."
        )

    text = message.lower()

    warning_signs = {
        "urgent": "Creates a sense of urgency",
        "verify your account": "Requests account verification",
        "click here": "Encourages clicking a link",
        "send money": "Requests a money transfer",
        "password": "Mentions a password",
        "otp": "Mentions a one-time password",
        "win a prize": "Claims you have won a prize",
        "claim your prize": "Encourages claiming a prize",
        "account suspended": "Threatens account suspension",
        "limited time": "Uses time pressure"
    }

    findings = [
        reason
        for phrase, reason in warning_signs.items()
        if phrase in text
    ]

    if len(findings) >= 3:
        risk = "High"
    elif len(findings) >= 1:
        risk = "Medium"
    else:
        risk = "Low"

    return render_template(
        "analyze.html",
        message=message,
        risk=risk,
        findings=findings
    )


@app.route("/api/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({
            "error": "No audio file was uploaded."
        }), 400

    audio = request.files["audio"]

    if not audio.filename:
        return jsonify({
            "error": "Please select an audio file."
        }), 400

    if not audio.mimetype.startswith("audio/"):
        return jsonify({
            "error": "Please upload a valid audio file."
        }), 400

    return jsonify({
        "message": "Audio received successfully.",
        "filename": audio.filename,
        "transcript": "",
        "status": "transcription_not_configured",
        "note": (
            "The backend received your audio, but a speech-to-text "
            "service must be connected to generate a transcript."
        )
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)