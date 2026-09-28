<p align="center">
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/CUDA-76B900?style=for-the-badge&logo=nvidia&logoColor=white" alt="CUDA"/>
</p>

<h1 align="center">🩻 X-Ray Enhancement</h1>

<p align="center">
  <strong>Clinical-Grade Super-Resolution for Chest X-Rays using Modified ESRGAN</strong>
</p>

<p align="center">
  <em>Bridging the diagnostic gap between low-resource clinics and high-resolution radiology — one pixel at a time.</em>
</p>

<p align="center">
  <a href="https://github.com/rohithsing/X-Ray-Enhancement">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github" alt="GitHub Repo"/>
  </a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/status-Active-brightgreen?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/PSNR-34.77%20dB-blue?style=flat-square" alt="PSNR"/>
  <img src="https://img.shields.io/badge/SSIM-0.9262-blue?style=flat-square" alt="SSIM"/>
</p>

---

## 🧬 The Problem

> Millions of chest X-rays are captured daily on **low-cost, portable equipment** in rural clinics and field hospitals. These images suffer from noise, blur, compression artifacts, and low resolution — making accurate diagnosis of conditions like **tuberculosis, pneumonia, and lung nodules** dangerously unreliable.

Standard AI super-resolution models (like vanilla ESRGAN) are trained on natural photographs and optimize for *visual appeal*. When applied to medical images, they **hallucinate anatomically plausible but clinically false details** — inventing nodules, vessels, and textures that don't exist in the patient's body.

**This project solves both problems simultaneously.**

---

## 🚀 What This Project Does

We built a **Modified ESRGAN pipeline** purpose-engineered for medical imaging that:

| Capability | Description |
|:---|:---|
| 🔬 **Enhances** low-quality X-rays | 2× super-resolution with clinical-grade fidelity |
| 🛡️ **Prevents hallucinations** | Custom Sobel edge constraint explicitly penalizes false anatomical details |
| 🏥 **Simulates real degradation** | Hardware-grounded synthetic pipeline mimicking budget X-ray equipment |
| 📊 **Validates rigorously** | Full 3-config ablation study with FID, PSNR, SSIM, and MS-SSIM metrics |
| 🌐 **Deploys as a web app** | FastAPI backend + React frontend with interactive before/after comparison |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        X-Ray Enhancement                        │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│   Frontend   │   Backend    │   Training   │   Degradation      │
│  (React +    │  (FastAPI +  │  (BasicSR +  │   Pipeline         │
│   Vite)      │   Uvicorn)   │   PyTorch)   │  (OpenCV + NumPy)  │
├──────────────┼──────────────┼──────────────┼────────────────────┤
│ Clinical     │ /api/enhance │ RRDBNet      │ PSF Blur           │
│ Dashboard    │ /api/degrade │ 23 RRDB      │ Bicubic Downscale  │
│ Before/After │ CUDA Infer.  │ Blocks       │ Gaussian + Poisson │
│ Slider UI    │ PNG I/O      │ 64 Filters   │ JPEG Compression   │
└──────────────┴──────────────┴──────────────┴────────────────────┘
```

---

## 🧪 The Core Innovation: Clinical Loss Function

The primary technical contribution of this project is replacing ESRGAN's VGG perceptual loss (designed for photographs) with a **clinically-grounded loss function** that preserves diagnostic integrity.

### Loss Formulation

$$L_{\text{clinical}} = \underbrace{L_1(SR, HR)}_{\text{Pixel Fidelity}} + \lambda_{\text{ssim}} \cdot \underbrace{(1 - \text{MS-SSIM}(SR, HR))}_{\text{Structural Similarity}} + \lambda_{\text{edge}} \cdot \underbrace{L_1(S(SR), S(HR))}_{\text{Anti-Hallucination}}$$

Where $S(I) = \sqrt{(I * G_x)^2 + (I * G_y)^2 + \epsilon}$ uses fixed Sobel kernels for edge detection.

### Why Each Component Matters

| Component | Purpose | Weight |
|:---|:---|:---:|
| **L1 Loss** | Pixel-level intensity fidelity — ensures brightness and contrast match | `1.0` |
| **MS-SSIM** | Multi-scale structural preservation — protects rib cage, heart shadow, lung field geometry | `λ = 0.5` |
| **Sobel Edge Loss** | **Anti-hallucination constraint** — penalizes any generated edge that doesn't exist in the ground truth | `λ = 0.1` |

> 💡 The Sobel kernels are **fixed** (non-learnable). This is intentional — the edge constraint acts as a hard physics-based regularizer, not a learned feature.

---

## 📊 Ablation Study Results

We conducted a rigorous 3-configuration ablation to isolate the impact of each modification:

| Config | Loss Function | PSNR ↑ | SSIM ↑ | Status |
|:---:|:---|:---:|:---:|:---:|
| **A** | Vanilla ESRGAN (L1 + VGG + GAN) | 37.57 dB | 0.951 | ⚠️ Hallucinations detected |
| **B** | L1 + MS-SSIM only | — | — | ❌ NaN collapse at step 12,416 |
| **C** | **L1 + MS-SSIM + Sobel Edge** *(Proposed)* | **34.77 dB** | **0.9262** | ✅ Clinically safe |

### Key Findings

- **Config A** achieved the highest PSNR but generated **false anatomical textures** — dangerous for diagnosis
- **Config B** suffered catastrophic gradient instability under AMP (float16), proving that MS-SSIM alone is insufficient
- **Config C** (our proposed model) sacrificed ~3dB PSNR for **clinical safety**, successfully suppressing hallucinations while maintaining strong structural fidelity

---

## 🔧 Synthetic Degradation Pipeline

Training data is generated by applying a **hardware-grounded 4-step degradation** to high-quality X-rays from the [NIH ChestX-ray14](https://www.nih.gov/news-events/news-releases/nih-clinical-center-provides-one-largest-publicly-available-chest-x-ray-datasets-scientific-community) dataset:

```
High-Quality X-Ray (1024×1024)
        │
        ▼
┌─────────────────────────────────┐
│  Step 1: PSF Blur               │  ← Simulates detector MTF degradation
│  Gaussian σ = 0.2 – 3.0 px     │    (low-cost flat panel sensors)
├─────────────────────────────────┤
│  Step 2: Bicubic Downscale      │  ← Simulates reduced pixel pitch
│  2× – 4× spatial reduction     │    (Siemens Mobilett / Carestream DRX)
├─────────────────────────────────┤
│  Step 3: Noise Injection        │  ← Simulates sensor noise at ~30dB SNR
│  Gaussian (thermal) + Poisson   │    (quantum/photon counting statistics)
│  (quantum mottle)               │
├─────────────────────────────────┤
│  Step 4: JPEG Compression       │  ← Simulates low-bandwidth PACS/DICOM
│  Quality factor: 30 – 95       │    transmission in budget systems
└─────────────────────────────────┘
        │
        ▼
Low-Quality Synthetic X-Ray (256×256)
```

> Degradation parameters were optimized using **Delta-FID** (Fréchet Inception Distance) with the Optuna framework to minimize the distributional gap between synthetic degradations and real-world low-quality X-rays.

---

## 📂 Project Structure

```
X-Ray-Enhancement/
│
├── 📁 backend/                  # FastAPI inference server
│   ├── main.py                  #   ├── /api/enhance  (super-resolution endpoint)
│   └── requirements.txt         #   └── /api/degrade  (degradation demo endpoint)
│
├── 📁 frontend/                 # React + Vite clinical dashboard
│   └── src/
│       ├── App.jsx              #   └── Interactive before/after slider UI
│       └── App.css              #       with clinical comparison tools
│
├── 📁 BasicSR/                  # Core SR training framework (RRDBNet, RCAN)
│
├── 📁 configs/                  # Training YAML configurations
│   ├── train_config_A.yaml      #   Config A: Vanilla ESRGAN baseline (RGB, VGG)
│   ├── train_config_B.yaml      #   Config B: L1 + MS-SSIM only
│   └── train_config_C.yaml      #   Config C: Full Clinical Loss (proposed)
│
├── 📁 scripts/                  # Training, evaluation & utility scripts
│   ├── train.py                 #   Main training loop
│   ├── train_ablation.py        #   Ablation study runner
│   ├── run_fid.py               #   FID evaluation
│   ├── validate_results.py      #   PSNR/SSIM validation
│   ├── degrade_dataset.py       #   Batch degradation pipeline
│   └── ...                      #   + 15 more utility scripts
│
├── 📁 notebooks/                # Jupyter/Colab notebooks (10 notebooks)
│   ├── NIH_Dataset_*.ipynb      #   Dataset preparation & streaming
│   ├── Robust_FID_*.ipynb       #   FID evaluation notebooks
│   └── Tune_*.ipynb             #   Hyperparameter tuning
│
├── 📁 docs_and_assets/          # Documentation, presentations, figures
│   ├── project_summary_report.md
│   ├── project_deep_dive.md
│   ├── degradation_comparison.png
│   └── training_snapshot.png
│
├── 📁 utils/                    # Shared utilities
│   └── metrics.py               #   PSNR/SSIM evaluation helpers
│
├── 📄 losses.py                 # ⭐ ClinicalSRLoss implementation
├── 📄 degradation.py            # ⭐ Synthetic degradation pipeline
└── 📄 dataset_download.py       # Dataset download helper
```

---

## ⚙️ Getting Started

### Prerequisites

| Requirement | Version | Notes |
|:---|:---|:---|
| Python | 3.8+ | 3.10+ recommended |
| PyTorch | 1.13+ | With CUDA support for GPU inference |
| Node.js | 18+ | For the React frontend |
| VRAM | 6GB+ | Minimum for inference; training benefits from more |

### 1. Clone the Repository

```bash
git clone https://github.com/rohithsing/X-Ray-Enhancement.git
cd X-Ray-Enhancement
```

### 2. Set Up the Python Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
pip install pytorch-msssim
```

### 3. Set Up the Frontend

```bash
cd frontend
npm install
cd ..
```

### 4. Download Model Checkpoints

Place your trained `.pth` checkpoint in the `checkpoints/` directory:

```
checkpoints/
└── Ablation_C_Clinical_ESRGAN_step_014000.pth
```

---

## 🖥️ Usage

### Running the Full Application

**Terminal 1 — Start the Backend:**
```bash
cd backend
python main.py
```
> Backend will be available at `http://localhost:8000`
> API docs at `http://localhost:8000/docs`

**Terminal 2 — Start the Frontend:**
```bash
cd frontend
npm run dev
```
> Frontend will be available at `http://localhost:5173`

### API Endpoints

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/api/enhance` | Upload a chest X-ray → receive enhanced PNG |
| `POST` | `/api/degrade` | Upload a chest X-ray → receive synthetically degraded PNG |

### Training

```bash
# Dry run (5 batches, memory test)
python scripts/train.py --dry-run

# Full training
python scripts/train.py --batch-size 4
```

### Degradation Pipeline (Standalone)

```bash
python degradation.py --test-image /path/to/xray.png --out-dir ./output
```

---

## 🧠 Model Details

| Parameter | Value |
|:---|:---|
| Architecture | RRDBNet (ESRGAN backbone) |
| RRDB Blocks | 23 |
| Base Feature Maps | 64 |
| Input Channels | 1 (native grayscale) |
| Output Channels | 1 |
| Scale Factor | 2× |
| Training Patch Size | 64×64 → 128×128 |
| Optimizer | Adam (lr = 2e-5) |
| Precision | float32 (AMP disabled for stability) |
| Dataset | NIH ChestX-ray14 + Montgomery |

---

## 📈 Evaluation Metrics

| Metric | Description | Our Result |
|:---|:---|:---:|
| **PSNR** | Peak Signal-to-Noise Ratio | 34.77 dB |
| **SSIM** | Structural Similarity Index | 0.9262 |
| **MS-SSIM** | Multi-Scale SSIM | ✅ Preserved |
| **FID** | Fréchet Inception Distance | ✅ Optimized via Delta-FID |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center"><strong>Layer</strong></td>
    <td align="center"><strong>Technology</strong></td>
    <td align="center"><strong>Purpose</strong></td>
  </tr>
  <tr>
    <td>🧠 Deep Learning</td>
    <td>PyTorch + BasicSR</td>
    <td>Model architecture, training, and inference</td>
  </tr>
  <tr>
    <td>🖼️ Image Processing</td>
    <td>OpenCV + NumPy + Pillow</td>
    <td>Degradation pipeline, pre/post-processing</td>
  </tr>
  <tr>
    <td>📐 Loss Functions</td>
    <td>pytorch-msssim + Custom Sobel</td>
    <td>Clinical SR loss with anti-hallucination</td>
  </tr>
  <tr>
    <td>⚡ Backend</td>
    <td>FastAPI + Uvicorn</td>
    <td>REST API for model inference</td>
  </tr>
  <tr>
    <td>🎨 Frontend</td>
    <td>React 19 + Vite</td>
    <td>Interactive clinical comparison dashboard</td>
  </tr>
  <tr>
    <td>📓 Notebooks</td>
    <td>Jupyter + Google Colab</td>
    <td>Dataset prep, FID tuning, evaluation</td>
  </tr>
  <tr>
    <td>🔬 Experiment Tracking</td>
    <td>Weights & Biases (W&B)</td>
    <td>Training metrics and hyperparameter sweeps</td>
  </tr>
</table>

---

## 📚 References & Citations

- **ESRGAN** — Wang et al., *ECCV 2018* — [arXiv:1809.00219](https://arxiv.org/abs/1809.00219)
- **Real-ESRGAN** — Wang et al., *ICCV 2021* — [arXiv:2107.10833](https://arxiv.org/abs/2107.10833)
- **MS-SSIM** — Wang et al., *IEEE Trans. Image Processing, 2003*
- **NIH ChestX-ray14** — Wang et al., *CVPR 2017*
- **BasicSR** — [github.com/XPixelGroup/BasicSR](https://github.com/XPixelGroup/BasicSR)

---

## 📜 License

This project is developed for the **IOMP Research Initiative**. See the repository for license details.

---

<p align="center">
  <strong>Built with 🫁 for better diagnostics in low-resource healthcare.</strong>
</p>

<p align="center">
  <a href="https://github.com/rohithsing/X-Ray-Enhancement">
    <img src="https://img.shields.io/badge/⭐_Star_this_repo-171515?style=for-the-badge&logo=github&logoColor=white" alt="Star this repo"/>
  </a>
</p>
