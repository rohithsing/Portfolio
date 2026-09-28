<div align="center">

# 🏛️ Chiron AI

### *The Wise Centaur of Modern Healthcare*

> Named after **Chiron** — the wisest centaur in Greek mythology who mentored Asclepius, the god of medicine — this AI-powered healthcare assistant bridges ancient healing wisdom with cutting-edge technology.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-chiron--ai.onrender.com-00C853?style=for-the-badge&logoColor=white)](https://chiron-ai.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rohithsing/Chiron-AI)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.0+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

**Chiron AI** is a comprehensive, AI-powered healthcare assistant that puts the power of intelligent medical guidance at your fingertips. From locating the nearest hospital to checking drug interactions and receiving personalized medication plans — Chiron is your trusted digital health companion.

[🚀 Try it Live](https://chiron-ai.onrender.com/) · [📖 Documentation](#-features-in-depth) · [🐛 Report Bug](https://github.com/rohithsing/Chiron-AI/issues) · [✨ Request Feature](https://github.com/rohithsing/Chiron-AI/issues)

---

</div>

## 📑 Table of Contents

- [✨ Why Chiron AI?](#-why-chiron-ai)
- [🧩 Features in Depth](#-features-in-depth)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📂 Project Structure](#-project-structure)
- [🔒 Security & Privacy](#-security--privacy)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## ✨ Why Chiron AI?

<table>
<tr>
<td width="50%">

### The Problem 🩺

Navigating healthcare is overwhelming. Patients juggle multiple medications, struggle to find nearby facilities, and often lack the tools to make informed health decisions — especially in emergencies.

</td>
<td width="50%">

### The Solution 💡

Chiron AI consolidates four critical healthcare services into one intelligent platform — powered by AI, backed by real medical databases, and accessible from anywhere in the world.

</td>
</tr>
</table>

### 🏆 Key Highlights

| Feature | Description |
|---------|-------------|
| 🧠 **AI-Powered Intelligence** | Leverages Groq's blazing-fast LLM inference for real-time medical analysis |
| 🗺️ **Real-Time Geolocation** | Interactive maps with live hospital & pharmacy discovery via OpenStreetMap |
| 💊 **Dual Drug Analysis** | Cross-references medical databases *and* AI reasoning for comprehensive safety checks |
| 🔐 **Privacy-First Design** | Zero data persistence — your medical information is never stored |
| 🌍 **Accessible Anywhere** | Fully deployed and accessible at [chiron-ai.onrender.com](https://chiron-ai.onrender.com/) |

---

## 🧩 Features in Depth

### 🏥 Hospital & Pharmacy Locator

> *Find medical facilities near you in seconds — with interactive maps and one-click navigation.*

- 📍 **Smart Geocoding** — Enter any address and get precise coordinates via Nominatim
- 🗺️ **Interactive Map View** — Powered by Mapbox with color-coded markers for hospitals (🔴) and pharmacies (🟢)
- 📏 **Distance Calculation** — Real-time geodesic distance from your location to each facility
- 📋 **Rich Facility Details:**
  - Phone numbers & websites
  - Operating hours & emergency availability
  - Wheelchair accessibility information
  - Full street address
- 🧭 **One-Click Navigation** — Direct Google Maps integration for turn-by-turn directions
- 🔎 **Adjustable Search Radius** — Customize from 1km to 10km

---

### 🤒 AI Symptom Checker

> *Describe your symptoms in plain language — Chiron's AI analyzes and guides you.*

- ✍️ **Natural Language Input** — No medical jargon needed; describe symptoms as you would to a friend
- 🧠 **AI-Powered Diagnosis Suggestions** — Identifies potential conditions based on symptom patterns
- 🚦 **Severity Assessment** — Helps you understand the urgency level of your symptoms
- 📝 **Actionable Next Steps** — Clear recommendations on whether to self-care, visit a clinic, or seek emergency attention
- ⚡ **Lightning-Fast Inference** — Powered by Groq's ultra-low-latency LLM engine

---

### 💊 Drug Interaction Checker

> *Before you mix medications, let Chiron check for dangerous interactions.*

- 🔬 **Dual-Layer Analysis:**
  - **Medical Database Lookup** — Checks against known drug interaction databases
  - **AI-Enhanced Analysis** — Uses LLM reasoning for nuanced interaction insights
- ⚠️ **Severity Classification** — Color-coded warnings from mild to critical
- 📖 **Detailed Explanations** — Understand *why* an interaction is dangerous and what to watch for
- 💡 **Alternative Suggestions** — Recommends safer medication alternatives when interactions are detected

---

### 💉 Personalized Medication Management

> *Get tailored medication plans that account for your unique medical profile.*

- 🎯 **Condition-Based Recommendations** — Enter your medical condition for targeted medication suggestions
- ⚗️ **Allergy-Aware Planning** — Filters out medications that conflict with your known allergies
- 🔄 **Current Medication Integration** — Cross-checks new recommendations against your existing prescriptions
- 🛡️ **Safety Checks** — Automatically verifies interactions between recommended and current medications
- 📊 **Comprehensive Reports** — Dosage guidelines, safety information, and precautionary notes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │ Hospital │ │ Symptom  │ │  Drug    │ │   Personalized     │  │
│  │ Locator  │ │ Checker  │ │ Interact.│ │   Medication       │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬───────────┘  │
│       │             │            │                │              │
└───────┼─────────────┼────────────┼────────────────┼──────────────┘
        │             │            │                │
        ▼             ▼            ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FLASK APPLICATION (app.py)                    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │  Geocoding  │  │  AI Engine      │  │  Drug Database      │  │
│  │  (Geopy +   │  │  (Groq LLM)     │  │  (DrugInteraction   │  │
│  │  Nominatim) │  │                 │  │   Checker)          │  │
│  └──────┬──────┘  └────────┬────────┘  └──────────┬──────────┘  │
│         │                  │                      │              │
└─────────┼──────────────────┼──────────────────────┼──────────────┘
          │                  │                      │
          ▼                  ▼                      ▼
  ┌───────────────┐  ┌──────────────┐  ┌────────────────────────┐
  │ OpenStreetMap │  │   Groq API   │  │  Medical Interaction   │
  │ Overpass API  │  │  (LLM Cloud) │  │      Databases         │
  └───────────────┘  └──────────────┘  └────────────────────────┘
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white) | Server-side logic & API routing |
| **AI/ML** | ![Groq](https://img.shields.io/badge/Groq-FF6B35?style=flat-square&logoColor=white) | Ultra-fast LLM inference for medical analysis |
| **Maps** | ![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=flat-square&logo=mapbox&logoColor=white) ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=flat-square&logo=openstreetmap&logoColor=white) | Interactive maps & geospatial data |
| **Geocoding** | `Geopy` · `Nominatim` · `Geocoder` | Address resolution & distance calculation |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | UI, styling & client-side interactivity |
| **Deployment** | ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white) | Cloud hosting & CI/CD |

</div>

### 📦 Core Dependencies

```
groq >= 0.18.0          # AI model integration (Groq LLM)
flask >= 2.0.1          # Web framework
geopy >= 2.3.0          # Geocoding & distance calculations
overpy >= 0.6           # OpenStreetMap Overpass API
folium >= 0.12.1        # Interactive map generation
geocoder >= 1.38.1      # Geocoding utilities
requests >= 2.31.0      # HTTP client
python-dotenv >= 1.0.0  # Environment variable management
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.8** or higher
- **pip** (Python package manager)
- **API Keys:**
  - [Mapbox Access Token](https://account.mapbox.com/access-tokens/) — for interactive maps
  - [Groq API Key](https://console.groq.com/keys) — for AI-powered analysis

### ⚙️ Installation

**1. Clone the repository**

```bash
git clone https://github.com/rohithsing/Chiron-AI.git
cd Chiron-AI
```

**2. Create & activate a virtual environment**

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Configure environment variables**

Create a `.env` file in the project root:

```env
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
GROQ_API_KEY=your_groq_api_key_here
```

**5. Launch the application**

```bash
python app.py
```

**6. Open in your browser**

```
http://localhost:5000
```

> 💡 **Or skip all of this and try the live deployment:** [https://chiron-ai.onrender.com/](https://chiron-ai.onrender.com/)

---

## 📂 Project Structure

```
Chiron-AI/
│
├── 📄 app.py                        # Main Flask application & route handlers
├── 🧠 symptom_checker.py            # AI symptom analysis module
├── 💊 DrugInteraction.py            # Drug interaction checker (DB + AI)
├── 💉 Personalised_Medication.py    # Personalized medication engine
│
├── 🌐 templates/                    # Jinja2 HTML templates
│   ├── index.html                   #   → Landing page
│   ├── about.html                   #   → About Chiron page
│   ├── hospital_locator.html        #   → Hospital & pharmacy finder
│   ├── symptom_checker.html         #   → Symptom analysis interface
│   ├── drug_interaction.html        #   → Drug interaction checker
│   └── personalized_medication.html #   → Personalized medication manager
│
├── 🎨 static/
│   └── styles.css                   # Global stylesheet
│
├── ⚙️ gunicorn_config.py            # Gunicorn production config
├── 🚀 render.yaml                   # Render deployment config
├── 📦 requirements.txt              # Python dependencies
├── 📝 LICENSE                       # MIT License
├── 🙈 .gitignore                    # Git ignore rules
└── 📖 README.md                     # You are here!
```

---

## 🔒 Security & Privacy

Chiron AI is built with a **privacy-first philosophy**:

| Principle | Implementation |
|-----------|---------------|
| 🚫 **No Data Persistence** | No personal medical data is stored — ever |
| 🔐 **Encrypted Communications** | All API calls use HTTPS/TLS encryption |
| 📍 **Ephemeral Location Data** | Your location is used only for the immediate search and then discarded |
| 🕵️ **No Tracking** | Zero analytics, cookies, or user fingerprinting |
| 🔑 **Server-Side Key Management** | All API keys remain on the server — never exposed to the client |

> ⚠️ **Disclaimer:** Chiron AI is an informational tool and is **not a substitute for professional medical advice**. Always consult a licensed healthcare provider for medical decisions.

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

### 💡 Ideas for Contributions

- 🌍 Multi-language support for global accessibility
- 📱 Progressive Web App (PWA) capabilities
- 📊 Health data visualization dashboards
- 🔔 Medication reminder notifications
- 🧪 Expanded drug interaction databases

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License · Copyright (c) 2025 Chiron Healthcare Assistant
```

---

## 🙏 Acknowledgments

- **[OpenStreetMap](https://www.openstreetmap.org/)** — Open geospatial data for medical facilities worldwide
- **[Groq](https://groq.com/)** — Ultra-fast AI inference powering Chiron's intelligence
- **[Mapbox](https://www.mapbox.com/)** — Beautiful, interactive map rendering
- **[Flask](https://flask.palletsprojects.com/)** — The micro web framework that makes it all possible
- **[Render](https://render.com/)** — Seamless cloud deployment platform
- **Chiron of Greek Mythology** — The immortal centaur who taught humanity the art of healing 🏛️

---

<div align="center">

**⭐ If Chiron AI helped you, consider giving it a star on [GitHub](https://github.com/rohithsing/Chiron-AI)!**

Made with ❤️ for better healthcare accessibility

[![GitHub Stars](https://img.shields.io/github/stars/rohithsing/Chiron-AI?style=social)](https://github.com/rohithsing/Chiron-AI)
[![GitHub Forks](https://img.shields.io/github/forks/rohithsing/Chiron-AI?style=social)](https://github.com/rohithsing/Chiron-AI/fork)

</div>
