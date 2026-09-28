<div align="center">

# 🧠 Personality Assessment System

### _Discover Your Inner Self — Powered by AI & Mapped to Anime_

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-FF6600?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

> **Answer 25 personality questions → AI analyzes your Big Five traits → Get your personality type + a matching anime character with beautiful visualizations**

[🚀 Get Started](#-quick-start) · [📖 Documentation](#-how-it-works) · [🤖 ML Pipeline](#-machine-learning-pipeline) · [🛠️ API Reference](#-api-reference) · [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Highlights

| | Feature | Description |
|---|---|---|
| 🎯 | **25-Question Assessment** | Scientifically-grounded Big Five personality quiz with Likert-scale responses |
| 🤖 | **XGBoost ML Model** | Trained classifier predicting 5 personality types with confidence probabilities |
| 🎌 | **Anime Character Match** | Fun twist — maps your personality to iconic anime characters (Naruto, Zoro, Levi & more) |
| 📊 | **Rich Visualizations** | Radar charts, pie charts, bar charts, and trait breakdowns powered by Recharts |
| 💾 | **Export Results** | Download your full assessment as a structured JSON file |
| 🔄 | **Offline Fallback** | Works even without the backend — falls back to a local heuristic engine |
| 🎨 | **Modern UI** | Beautiful, responsive interface built with React 18 + TailwindCSS |

---

## 📸 How It Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER (:3000)                         │
│                                                                        │
│   ┌──────────┐    ┌──────────────┐    ┌────────────────────────────┐   │
│   │  Intro   │───▶│  25 Question │───▶│       Results Page          │   │
│   │  Page    │    │  Assessment  │    │  ┌─────────┬──────────┐    │   │
│   │          │    │              │    │  │ Anime   │ Big Five │    │   │
│   │ Name     │    │ Progress Bar │    │  │ Match   │ Scores   │    │   │
│   │ Age      │    │ Likert Scale │    │  ├─────────┼──────────┤    │   │
│   │ Gender   │    │ Navigation   │    │  │ Pie     │ Bar      │    │   │
│   └──────────┘    └──────┬───────┘    │  │ Chart   │ Chart    │    │   │
│                          │            │  ├─────────┴──────────┤    │   │
│                          │            │  │ Strengths & Growth │    │   │
│                          │            │  └────────────────────┘    │   │
│                          │            └────────────────────────────┘   │
└──────────────────────────┼────────────────────────────────────────────┘
                           │ POST /api/predict
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       FLASK BACKEND (:5000)                            │
│                                                                        │
│   ┌──────────────┐    ┌──────────────────┐    ┌────────────────────┐   │
│   │  Validate    │───▶│  Preprocess &    │───▶│  XGBoost Predict   │   │
│   │  Input Data  │    │  Feature Eng.    │    │  + Probabilities   │   │
│   └──────────────┘    └──────────────────┘    └────────────────────┘   │
│                                                                        │
│   Models: personality_model.joblib │ scaler.joblib │ label_encoder     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Flow

1. **Landing Page** — User enters their name, age, and gender
2. **Questionnaire** — 25 personality questions presented one at a time with a progress bar
3. **Score Calculation** — Frontend computes Big Five trait scores (handling reverse-scored items)
4. **ML Prediction** — Scores are sent to the Flask API → XGBoost predicts personality type
5. **Results** — Rich dashboard with personality type, anime match, charts, strengths & growth areas
6. **Export** — Results auto-download as a timestamped JSON file

---

## 🧬 The Big Five (OCEAN) Model

This system is built on the **Big Five personality model**, the most widely accepted framework in personality psychology:

| Trait | Emoji | What It Measures |
|---|---|---|
| **O**penness | 🎨 | Creativity, curiosity, and openness to new experiences |
| **C**onscientiousness | 📋 | Organization, dependability, and self-discipline |
| **E**xtraversion | 🎉 | Sociability, assertiveness, and positive emotions |
| **A**greeableness | 🤝 | Cooperation, trust, and empathy towards others |
| **N**euroticism | 🌊 | Emotional instability, anxiety, and mood fluctuations |

### Predicted Personality Types

| Type | Description | Anime Match |
|---|---|---|
| **Dependable** | Reliable, organized, detail-oriented | Tanjiro Kamado |
| **Serious** | Focused, thoughtful, analytical | Levi Ackerman |
| **Responsible** | Duty-driven, trustworthy, committed | Zoro |
| **Extraverted** | Social, energetic, outgoing | Naruto Uzumaki |
| **Lively** | Enthusiastic, spontaneous, vibrant | Luffy |

---

## 🏗️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS_3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square&logo=chart.js&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square)

### Backend
![Python](https://img.shields.io/badge/Python_3.8+-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask_3.0-000000?style=flat-square&logo=flask&logoColor=white)
![Gunicorn](https://img.shields.io/badge/Gunicorn-499848?style=flat-square&logo=gunicorn&logoColor=white)

### Machine Learning
![XGBoost](https://img.shields.io/badge/XGBoost-FF6600?style=flat-square)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)
![pandas](https://img.shields.io/badge/pandas-150458?style=flat-square&logo=pandas&logoColor=white)
![SMOTE](https://img.shields.io/badge/imbalanced--learn_(SMOTE)-4B8BBE?style=flat-square)

</div>

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Check Command |
|---|---|---|
| Python | 3.8+ | `python --version` |
| Node.js | 14+ | `node --version` |
| npm | 6+ | `npm --version` |
| Git | Any | `git --version` |

> [!NOTE]
> **No external services required!** No database, no API keys, no cloud services, no GPU. Everything runs locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rohithsing/personality-assessment-system.git
cd personality-assessment-system
```

### 2️⃣ Set Up the Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (optional — defaults work fine)
copy .env.example .env          # Windows
# cp .env.example .env          # macOS/Linux

# Start the server
python app.py
```

> The backend runs on **http://localhost:5000**
> On first run, the model auto-trains from `psyc.csv` and saves `.joblib` artifacts.

### 3️⃣ Set Up the Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm start
```

> The frontend runs on **http://localhost:3000** and opens automatically in your browser.

### 4️⃣ Verify

| Check | URL | Expected |
|---|---|---|
| Frontend | http://localhost:3000 | Landing page loads |
| Backend Health | http://localhost:5000/api/health | `{"status": "healthy", "model_loaded": true}` |

---

## 📁 Project Structure

```
personality-assessment-system/
│
├── 📂 backend/                          # Python Flask API + ML Engine
│   ├── app.py                           # ⭐ Flask server — API endpoints
│   ├── personality_model.py             # ⭐ ML model — training & inference
│   ├── psyc.csv                         # Training dataset (316 records)
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.example                     # Environment variable template
│   ├── personality_model.joblib         # Trained XGBoost model (auto-generated)
│   ├── scaler.joblib                    # Fitted StandardScaler (auto-generated)
│   └── label_encoder.joblib            # Fitted LabelEncoder (auto-generated)
│
├── 📂 frontend/                         # React 18 SPA
│   ├── public/
│   │   ├── index.html                   # HTML template
│   │   └── favicon.svg                  # Browser tab icon
│   ├── src/
│   │   ├── App.js                       # ⭐ Main component (quiz, results, charts)
│   │   ├── index.js                     # React DOM entry point
│   │   ├── index.css                    # Global styles + Tailwind imports
│   │   └── components/
│   │       └── PersonalityTest.js       # Alternative direct-input component
│   ├── package.json                     # Node.js dependencies
│   ├── tailwind.config.js              # TailwindCSS config
│   └── postcss.config.js              # PostCSS plugin config
│
├── 📂 mentioned/                        # Misc reference files
├── sample_personality_result.json       # Example output for reference
├── PROJECT_GUIDE.md                     # Comprehensive project documentation
└── README.md                            # ← You are here
```

---

## 🤖 Machine Learning Pipeline

### Training Pipeline

```
psyc.csv (316 records)
    │
    ▼
┌──────────────────┐
│  Label Encoding   │  Personality → 0-4
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Feature Engineer  │  4 interaction features:
│                   │  • open_ext = openness × extraversion
│                   │  • con_agr = conscientiousness × agreeableness
│                   │  • neu_minus_con = neuroticism - conscientiousness
│                   │  • stability = 10 - neuroticism
└────────┬─────────┘
         ▼
┌──────────────────┐
│  One-Hot Encode   │  gender → gender_Male (binary)
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Train/Test Split │  80/20, stratified by class
└────────┬─────────┘
         ▼
┌──────────────────┐
│  StandardScaler   │  z-score normalization (fit on train only)
└────────┬─────────┘
         ▼
┌──────────────────┐
│     SMOTE         │  Oversample minority classes (train only)
└────────┬─────────┘
         ▼
┌──────────────────┐
│  XGBClassifier    │  500 trees, depth=9, lr=0.05
│                   │  subsample=0.8, colsample=0.8
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Save Artifacts   │  → personality_model.joblib
│                   │  → scaler.joblib
│                   │  → label_encoder.joblib
└──────────────────┘
```

### Model Specifications

| Parameter | Value |
|---|---|
| Algorithm | XGBoost (`XGBClassifier`) |
| Task | Multi-class classification (5 classes) |
| Estimators | 500 |
| Max Depth | 9 |
| Learning Rate | 0.05 |
| Subsample | 0.8 |
| Feature Count | 11 (7 original + 4 engineered) |
| Training Samples | 316 (augmented via SMOTE) |
| Test Accuracy | ~63% |

### Check Model Performance

```bash
cd backend
python personality_model.py
```

This prints training/test accuracy, F1 scores, and a full classification report.

---

## 🛠️ API Reference

### `GET /api/health`

Health check endpoint to verify the server and model status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

---

### `POST /api/predict`

Predict personality type from Big Five trait scores.

**Request Body:**
```json
{
  "gender": "male",
  "age": 25,
  "openness": 7,
  "neuroticism": 4,
  "conscientiousness": 8,
  "agreeableness": 6,
  "extraversion": 5
}
```

**Success Response (200):**
```json
{
  "success": true,
  "prediction": "serious",
  "probabilities": {
    "dependable": 0.0823,
    "extraverted": 0.1245,
    "lively": 0.0367,
    "responsible": 0.0712,
    "serious": 0.6853
  }
}
```

**Error Responses:**

| Status | Cause | Response |
|---|---|---|
| `400` | Missing required fields | `{ "success": false, "error": "Missing required fields: ..." }` |
| `400` | Invalid data types | `{ "success": false, "error": "Invalid data type for input fields: ..." }` |
| `500` | Model/prediction failure | `{ "success": false, "error": "Failed to make prediction: ..." }` |

---

## 🌐 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `FLASK_APP` | `app.py` | Flask entry point |
| `FLASK_ENV` | `development` | Environment mode |
| `SECRET_KEY` | — | Flask session encryption key |
| `DEBUG` | `True` | Enable debug mode |
| `PORT` | `5000` | Backend server port |
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend URL for the frontend |

---

## 🐛 Troubleshooting

<details>
<summary><strong>Backend won't start</strong></summary>

```bash
# Make sure your virtual environment is activated
which python     # macOS/Linux
where python     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```
</details>

<details>
<summary><strong>CORS errors in browser console</strong></summary>

- Ensure the backend is running on port **5000**
- Check that `API_URL` in `frontend/src/App.js` points to `http://localhost:5000/api`
- Flask-CORS is configured to allow `localhost:3000` by default
</details>

<details>
<summary><strong>Model not loading / training errors</strong></summary>

- Verify `psyc.csv` exists in the `backend/` directory
- The model auto-trains on first startup if `.joblib` files are missing
- Delete all `.joblib` files to force retraining: `rm backend/*.joblib`
</details>

<details>
<summary><strong>Frontend fails to build</strong></summary>

```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules
cd frontend && npm install
```
</details>

---

## 🔄 Offline Fallback

When the Flask backend is unavailable, the frontend **automatically falls back** to a local heuristic engine:

```
Backend unreachable (timeout: 5 seconds)
    ↓
calculatePersonalityLocal() activates
    ↓
Weighted trait scoring:
  dependable  = conscientiousness × 0.8 + agreeableness × 0.2
  serious     = conscientiousness × 0.6 + emotional_stability × 0.4
  responsible = conscientiousness × 0.7 + agreeableness × 0.3
  extraverted = extraversion × 0.8 + openness × 0.2
  lively      = extraversion × 0.7 + openness × 0.3
    ↓
Results displayed normally (without ML precision)
```

---

## 📄 Sample Output

<details>
<summary>Click to expand a sample personality assessment result</summary>

```json
{
  "userInfo": {
    "name": "John Doe",
    "gender": "male",
    "timestamp": "2025-10-29T10:51:00+05:30"
  },
  "personalityType": "dependable",
  "confidence": 78.5,
  "bigFiveScores": {
    "openness": 3.8,
    "conscientiousness": 4.5,
    "extraversion": 3.2,
    "agreeableness": 4.1,
    "emotionalStability": 3.9
  },
  "recommendations": [
    "Consider taking on leadership roles where your dependability can shine.",
    "Your high conscientiousness suggests you might enjoy project management.",
    "To balance your profile, try engaging in more creative or social activities.",
    "Your emotional stability makes you a great candidate for high-pressure situations."
  ]
}
```

</details>

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Ideas for Contribution

- 🎨 Add more anime character mappings
- 📊 Implement additional visualization types
- 🧪 Increase model accuracy with more training data
- 🌍 Add internationalization (i18n) support
- 📱 Improve mobile responsiveness
- 🔐 Add user authentication and result history

---

## 📚 Learn More

- 📖 **[PROJECT_GUIDE.md](PROJECT_GUIDE.md)** — Comprehensive 1800+ line project documentation covering architecture, code flows, and reverse engineering of every file
- 🧪 **[sample_personality_result.json](sample_personality_result.json)** — Example assessment output
- 📘 [Big Five Personality Traits (Wikipedia)](https://en.wikipedia.org/wiki/Big_Five_personality_traits)
- 📗 [XGBoost Documentation](https://xgboost.readthedocs.io/)
- 📙 [Flask Documentation](https://flask.palletsprojects.com/)

---

<div align="center">

### ⭐ Star this repo if you found it interesting!

**Built with ❤️ by [Rohith Singh](https://github.com/rohithsing)**

[🔝 Back to Top](#-personality-assessment-system)

</div>