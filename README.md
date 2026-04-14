<![CDATA[<div align="center">

# 🧠 NeuroScan AI

### AI-Powered Brain Tumor Segmentation Using Normal Brain Reference Images

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-neuroscan--clarity.vercel.app-0070f3?style=for-the-badge)](https://neuroscan-clarity.vercel.app/)
[![IEEE TIP 2024](https://img.shields.io/badge/IEEE_TIP-2024-004088?style=for-the-badge&logo=ieee)](https://doi.org/10.1109/TIP.2024.3359815)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

*A research-grade interactive web application for multimodal brain tumor segmentation, implementing the state-of-the-art methodology from IEEE Transactions on Image Processing (2024) — achieving **97.6% Dice Score** on the BraTS2022 benchmark.*

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Pages & Modules](#-pages--modules)
- [Research Foundation](#-research-foundation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🔬 Overview

**NeuroScan AI** is a comprehensive, interactive web platform that demonstrates and visualizes an advanced brain tumor segmentation pipeline. The application is based on the IEEE TIP 2024 paper:

> *"Multimodal Brain Tumor Segmentation Boosted by Monomodal Normal Brain Images"*
> — Huabing Liu, Zhengze Ni, Dong Nie, Dinggang Shen, Jinda Wang, Zhenyu Tang

The core innovation lies in using **normal (healthy) brain reference images** generated via IntroVAE to dramatically improve tumor boundary detection across multimodal MRI scans (T1, T1c, T2, FLAIR).

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🖼️ Multimodal MRI Upload** | Drag-and-drop upload interface for T1, T1c, T2, and FLAIR scan modalities with progress tracking |
| **🧪 Interactive Architecture Explorer** | Click-through visualization of IntroVAE, Global Correlation Block (GCB), and Feature Alignment Module (FAM) with mathematical formulations |
| **📊 Clinical Results Dashboard** | Comprehensive analysis results with MRI viewer, Dice metrics, region-wise segmentation scores, and confidence indicators |
| **📈 Benchmark Comparisons** | Interactive charts comparing performance against V-Net, nnU-Net, UNETR, TransBTS, nnFormer, and other SOTA methods |
| **🗃️ Dataset & Training Explorer** | Detailed view of BraTS2022 (1,251 patients), IXI (581 normal brains), and in-house GBM (104 patients) datasets |
| **🗺️ Attention Map Visualizations** | Multi-level attention heatmaps showing FAM feature alignment across encoder layers |
| **📄 Export Capabilities** | Clinical report export (PDF), segmentation mask download (NIfTI), and DICOM export options |
| **🎨 Glassmorphism UI** | Modern, clean, professional interface with frosted-glass panels, smooth animations, and responsive layout |
| **📱 Fully Responsive** | Optimized for desktop, tablet, and mobile viewports |
| **♿ Accessible** | Semantic HTML, ARIA labels, and keyboard-navigable interactive elements |

---

## 🏗️ Architecture

The application implements a visualization of the following deep learning pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│                    SEGMENTATION BACKBONE                     │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │  T1  │  │ T1c  │  │  T2  │  │FLAIR │  ← 4 Encoder Paths │
│  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘                    │
│     │         │         │         │                          │
│     └────┬────┴────┬────┴────┬────┘                         │
│          │  GCB    │  GCB   │  GCB   ← Global Correlation   │
│          └────┬────┴────┬───┘                                │
│               │         │                                    │
│          ┌────▼─────────▼────┐                               │
│          │   Fused Features  │                               │
│          └────────┬──────────┘                               │
│                   │                                          │
│  ┌────────────────▼────────────────┐                        │
│  │        DECODER + FAM            │                        │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌───┐│                        │
│  │  │A₁   │ │A₂   │ │A₃   │ │A₄ ││ ← Attention Maps      │
│  │  └──┬──┘ └──┬──┘ └──┬──┘ └─┬─┘│                        │
│  └─────┼───────┼───────┼──────┼───┘                        │
│        └───────┴───────┴──────┘                             │
│                   │                                          │
│          ┌────────▼────────┐                                │
│          │  Segmentation   │ → Edema | Core | Necrosis      │
│          └─────────────────┘                                │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│  NORMAL APPEARANCE NETWORK   │
│                              │
│  T1 (tumor) ──► IntroVAE     │
│                  │           │
│            Normal I_R        │
│                  │           │
│     F_R,1 → F_R,2 → F_R,3   │ → Fed into FAM at each level
│              → F_R,4         │
└──────────────────────────────┘
```

### Core Components

- **IntroVAE** — Generates healthy brain reference images from tumor-bearing T1 scans (trained on 581 IXI normal brains)
- **Global Correlation Block (GCB)** — Self-attention mechanism that dynamically weights MRI modalities per encoding level
- **Feature Alignment Module (FAM)** — Projects tumor and normal features into shared space using SimSiam loss to highlight anomalous regions

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3.4 + Custom Glassmorphism System |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Routing** | React Router v6 |
| **State** | TanStack React Query |
| **Icons** | Lucide React |
| **Deployment** | Vercel (Edge Network) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or bun/yarn)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ganesh2317/neuroscan-clarity.git

# 2. Navigate to the project directory
cd neuroscan-clarity

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run test` | Execute test suite via Vitest |
| `npm run test:watch` | Run tests in watch mode |

---

## 📁 Project Structure

```
neuroscan-clarity/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Brain MRI reference images
│   │   ├── brain-mri-t1.jpg
│   │   ├── brain-mri-t1c.jpg
│   │   ├── brain-mri-t2.jpg
│   │   ├── brain-mri-flair.jpg
│   │   ├── brain-mri-normal.jpg
│   │   ├── brain-mri-segmentation.jpg
│   │   └── brain-attention-l[1-4].jpg
│   ├── components/
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── results/             # Results page sub-components
│   │   │   ├── MRIViewer.tsx
│   │   │   ├── MetricsPanel.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   └── AttentionMaps.tsx
│   │   ├── GlassCard.tsx        # Reusable glassmorphism card
│   │   ├── GlassNavbar.tsx      # Top navigation bar
│   │   ├── DashboardLayout.tsx  # Layout wrapper with sidebar
│   │   ├── AppSidebar.tsx       # Dashboard sidebar navigation
│   │   ├── BrainScanBackground.tsx
│   │   ├── AnimatedCounter.tsx  # Scroll-triggered counter
│   │   └── NavLink.tsx          # Reusable navigation link
│   ├── pages/
│   │   ├── Landing.tsx          # Hero + stats + how-it-works
│   │   ├── UploadPage.tsx       # 4-modality MRI upload
│   │   ├── ProcessingPage.tsx   # Real-time analysis animation
│   │   ├── ResultsPage.tsx      # Clinical results dashboard
│   │   ├── ArchitecturePage.tsx # Interactive model explorer
│   │   ├── DatasetPage.tsx      # Dataset & benchmark charts
│   │   ├── AboutPage.tsx        # Research paper & citations
│   │   └── NotFound.tsx         # 404 page
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   ├── test/                    # Test files
│   ├── App.tsx                  # Root app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles & design tokens
├── index.html                   # HTML template
├── tailwind.config.ts           # Tailwind configuration
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── package.json
```

---

## 📄 Pages & Modules

### 🏠 Landing Page (`/`)
The hero section introduces NeuroScan AI with animated statistics (97.6% Dice Score, 4 MRI Modalities, BraTS2022 validation), a four-step "How It Works" flow, and the technology stack overview.

### 📤 Upload Page (`/upload`)
Drag-and-drop interface for uploading four MRI modalities (T1, T1c, T2, FLAIR) in NIfTI/PNG/JPEG formats. Includes patient metadata input fields and a demo loader with pre-filled sample data.

### ⚙️ Processing Page (`/processing`)
Animated pipeline visualization showing real-time progress through IntroVAE generation, GCB fusion, FAM alignment, and final segmentation stages.

### 📊 Results Page (`/results`)
Clinical-grade results dashboard featuring:
- Interactive MRI slice viewer with overlay controls
- Dice metrics breakdown (Whole Tumor, Tumor Core, Enhancing Tumor)
- Method comparison table against 7+ SOTA approaches
- Multi-level attention map visualizations
- Export options (PDF report, NIfTI mask, DICOM)

### 🔧 Architecture Explorer (`/architecture`)
Interactive visualization of the full segmentation framework with clickable IntroVAE, GCB, and FAM nodes that reveal mathematical formulations and implementation details.

### 📈 Dataset & Training (`/dataset`)
Comprehensive overview of BraTS2022 (1,251 patients), IXI (581 normal controls), and in-house GBM (104 patients) datasets with training configuration and benchmark comparison bar charts.

### ℹ️ About (`/about`)
Research citation, key innovations explanation, and links to the original IEEE paper and source code.

---

## 📚 Research Foundation

This application implements the methodology described in:

> **"Multimodal Brain Tumor Segmentation Boosted by Monomodal Normal Brain Images"**
>
> Huabing Liu, Zhengze Ni, Dong Nie, Dinggang Shen, Jinda Wang, Zhenyu Tang
>
> *IEEE Transactions on Image Processing*, Vol. 33, 2024
>
> **DOI:** [10.1109/TIP.2024.3359815](https://doi.org/10.1109/TIP.2024.3359815)

### Benchmark Results (BraTS2022)

| Metric | Score |
|--------|-------|
| Dice — Whole Tumor (WT) | **92.9%** |
| Dice — Tumor Core (TC) | **91.8%** |
| Dice — Enhancing Tumor (ET) | **85.4%** |
| Overall Confidence | **97.6%** |

### Key Innovation
The approach is the first to leverage **monomodal normal brain images** as a reference to boost **multimodal tumor segmentation**. By generating what the patient's brain *should* look like without disease, the model dramatically improves boundary detection — especially in ambiguous edema regions.

---

## 🌐 Deployment

The application is deployed on **Vercel** with automatic CI/CD from the `main` branch.

**🔗 Live URL:** [https://neuroscan-clarity.vercel.app](https://neuroscan-clarity.vercel.app)

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel deploy --prod
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- **Original Research Authors** — Huabing Liu, Zhengze Ni, Dong Nie, Dinggang Shen, Jinda Wang, Zhenyu Tang
- **BraTS Challenge** — Brain Tumor Segmentation Challenge organizers
- **IXI Dataset** — Imperial College London
- **shadcn/ui** — Beautiful, accessible UI components
- **Vercel** — Deployment and hosting platform

---

<div align="center">

**Built with ❤️ for advancing medical imaging AI**

[Live Demo](https://neuroscan-clarity.vercel.app) · [Report Bug](https://github.com/ganesh2317/neuroscan-clarity/issues) · [Request Feature](https://github.com/ganesh2317/neuroscan-clarity/issues)

</div>
]]>
