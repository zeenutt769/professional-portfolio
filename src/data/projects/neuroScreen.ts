export const neuroScreen = {
    id: "neuro_screen",
    title: "NeuroScreen",
    subtitle: "ASD Detection API — Autism Spectrum Disorder Intelligence",
    description:
        "An intelligent, fast, and scalable ML API to detect Autism Spectrum Disorder (ASD) in both adults and children using 5 pre-trained models (Random Forest, XGBoost, AdaBoost, Gradient Boosting, CART). Deployed on Hugging Face Spaces via Docker.",
    longDescription: `
NeuroScreen is a production-grade machine learning API capable of receiving 18 clinical/behavioral features and returning a prediction on whether a subject is ASD Positive or ASD Negative.

 Multiple State-of-the-Art Models — Supports 5 pre-trained classifiers customized for both Child and Adult datasets:
  • Random Forest   • XGBoost   • AdaBoost
  • Decision Tree (CART)   • Gradient Boosting

Each prediction includes a confidence score and full probability breakdown.

 NeuroScreen Frontend UI — A glassmorphism-inspired single-page web application that serves the standard AQ-10 clinical screening test interactively. The frontend is native to the backend — served directly by FastAPI via StaticFiles.

 How It Works:
1. User answers 10 behavioral questions (A1–A10) + Age & Gender
2. JavaScript validates all inputs before submission
3. Feature vector of 18 dimensions is constructed (10 AQ scores + age/gender + 6 baseline-padded demographic fields)
4. Async fetch() POST to /predict — model is auto-selected (child vs. adult) based on age
5. FastAPI returns prediction label + confidence + probabilities
6. DOM updates with elegant result modal (color-coordinated ASD+/ASD-)

🌐 Deployed on Hugging Face Spaces (Docker container, port 7860).
Live: https://zeenu002-asd-detection-api.hf.space/
`,
    type: "ML API + Web App",
    tech: [
        "Python 3.10",
        "FastAPI",
        "Uvicorn",
        "Scikit-Learn",
        "XGBoost",
        "Numpy",
        "Joblib",
        "Docker",
        "Hugging Face Spaces",
        "JavaScript",
        "HTML/CSS"
    ],
    links: {
        github: "https://github.com/zeenutt769/NeuroScreen",
        live: "https://zeenu002-asd-detection-api.hf.space/"
    },
    image: "https://opengraph.githubassets.com/1/zeenutt769/NeuroScreen",
    date: "2025",
    role: "ML Engineer & Full-Stack Developer",
    highlights: [
        " 5 pre-trained ML models: XGBoost, Random Forest, AdaBoost, CART, Gradient Boosting",
        " Separate models for Child vs. Adult ASD datasets",
        " Confidence scores + probability breakdown per prediction",
        " Glassmorphism AQ-10 interactive frontend served via FastAPI StaticFiles",
        " Dockerized & deployed on Hugging Face Spaces (port 7860)",
        " CORSMiddleware for seamless third-party web client access",
        " Programmatic deploy via huggingface_hub Python library",
        " 18-feature vector with automatic demographic field padding"
    ],
    featured: true,
    languages: [
        { name: "Python", percent: 65, color: "#3776ab" },
        { name: "JavaScript", percent: 20, color: "#f7df1e" },
        { name: "HTML/CSS", percent: 10, color: "#e34c26" },
        { name: "Docker", percent: 5, color: "#2496ed" }
    ],
    deployHistory: [
        {
            version: "v2.0",
            msg: "Frontend now native to backend via FastAPI StaticFiles. CORSMiddleware added.",
            time: "2025",
            status: "success"
        },
        {
            version: "v1.0",
            msg: "Initial HuggingFace Spaces Docker deployment with 5 ML models.",
            time: "2025",
            status: "success"
        }
    ],
    snippet: `# NeuroScreen — FastAPI Prediction Endpoint
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, numpy as np

app = FastAPI(title="NeuroScreen ASD Detection API")

app.add_middleware(CORSMiddleware, allow_origins=["*"],
    allow_methods=["*"], allow_headers=["*"])

# Load pre-trained models
models = {
    "xgboost_adult":  joblib.load("models/xgboost_adult.pkl"),
    "xgboost_child":  joblib.load("models/xgboost_child.pkl"),
    "rf_adult":       joblib.load("models/rf_adult.pkl"),
    "adaboost_adult": joblib.load("models/adaboost_adult.pkl"),
}

class PredictRequest(BaseModel):
    features: list[float]  # 18-dimensional feature vector
    model_name: str        # e.g. "xgboost_adult"

@app.post("/predict")
async def predict(req: PredictRequest):
    model = models[req.model_name]
    X = np.array(req.features).reshape(1, -1)
    
    prediction = model.predict(X)[0]
    proba = model.predict_proba(X)[0]
    confidence = round(max(proba) * 100, 2)
    
    return {
        "model_used": req.model_name,
        "prediction": int(prediction),
        "prediction_label": "ASD Positive ✅" if prediction == 1 else "ASD Negative ❌",
        "confidence": confidence,
        "probabilities": {
            "ASD_negative": round(proba[0], 3),
            "ASD_positive": round(proba[1], 3)
        }
    }
`,
    architecture: `
[NeuroScreen Frontend (AQ-10 Form)]
  → HTML/CSS/JS (glassmorphism UI)
  → Served by FastAPI StaticFiles at /
         |
         | HTTP POST /predict
         ▼
[FastAPI Backend (Uvicorn)]
  → CORSMiddleware
  → PredictRequest (Pydantic validation)
  → 18-feature vector
         |
         ├── Age < 18 → xgboost_child / rf_child
         └── Age ≥ 18 → xgboost_adult / rf_adult / adaboost / cart / gb
         |
         ▼
[Joblib Model (.pkl)]
  → predict() + predict_proba()
  → confidence score + probabilities
         |
         ▼
[JSON Response]
  → prediction_label, confidence, probabilities
         |
[Hugging Face Spaces — Docker Container]
  → python:3.10-slim image, port 7860
  → zeenu002/asd-detection-api
`
};
