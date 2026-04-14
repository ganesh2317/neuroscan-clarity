# 🧠 NeuroScan AI

**AI-Powered Brain Tumor Segmentation Using Normal Brain Reference Images**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-0070f3?style=flat-square)](https://neuroscan-clarity.vercel.app/)
[![IEEE TIP 2024](https://img.shields.io/badge/IEEE_TIP-2024-004088?style=flat-square)](https://doi.org/10.1109/TIP.2024.3359815)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A research-grade interactive web application for multimodal brain tumor segmentation. Implements the state-of-the-art methodology from **IEEE Transactions on Image Processing (2024)**, achieving **97.6% accuracy** on the BraTS2022 benchmark.

🔗 **Live:** [neuroscan-clarity.vercel.app](https://neuroscan-clarity.vercel.app/)

---

## Overview

**NeuroScan AI** demonstrates an advanced brain tumor segmentation pipeline based on the IEEE TIP 2024 paper by Liu et al. The core innovation: using **normal (healthy) brain reference images** generated via IntroVAE to dramatically improve tumor boundary detection across multimodal MRI scans.

### How It Works

```
1. Upload    →  Patient uploads T1, T1c, T2, FLAIR MRI scans
2. Generate  →  IntroVAE creates a healthy brain reference from T1
3. Align     →  FAM compares tumor features against the normal reference
4. Segment   →  Outputs precise tumor region maps (Edema, Core, Necrosis)
```

---

## Key Features

🖼️ **Multimodal MRI Upload** — Drag-and-drop for T1, T1c, T2, FLAIR with progress tracking

🧪 **Interactive Architecture Explorer** — Click-through IntroVAE, GCB, and FAM with math formulations

📊 **Clinical Results Dashboard** — MRI viewer, Dice metrics, confidence indicators

📈 **Benchmark Comparisons** — Charts against V-Net, nnU-Net, UNETR, TransBTS, and more

🗃️ **Dataset Explorer** — BraTS2022 (1,251 patients), IXI (581 normal brains), in-house GBM (104 patients)

🗺️ **Attention Maps** — Multi-level heatmaps showing FAM feature alignment

📄 **Export Options** — Clinical PDF reports, NIfTI segmentation masks, DICOM export

🎨 **Modern UI** — Glassmorphism design, smooth animations, fully responsive

---

## Architecture

The segmentation pipeline consists of three major components:

```
                    ┌──────────────────────────────┐
                    │   SEGMENTATION BACKBONE       │
                    │                               │
  MRI Inputs        │   T1 ──┐                      │
  (4 modalities)    │  T1c ──┼──► GCB Fusion ──►   │
                    │   T2 ──┤    (per level)       │
                    │ FLAIR ──┘                      │
                    │            │                   │
                    │            ▼                   │
                    │     Decoder + FAM              │
                    │     (4 attention levels)       │
                    │            │                   │
                    │            ▼                   │
                    │   3-Class Segmentation Map     │
                    └──────────────────────────────┘

                    ┌──────────────────────────────┐
                    │  NORMAL APPEARANCE NETWORK    │
                    │                               │
                    │  T1 (tumor) ──► IntroVAE      │
                    │                   │            │
                    │           Normal Brain I_R     │
                    │                   │            │
                    │  Features F_R ──► FAM          │
                    └──────────────────────────────┘
```

**IntroVAE** — Generates healthy brain reference from tumor T1 scans (trained on 581 IXI normals)

**GCB** — Self-attention that dynamically weights modalities per encoding level

**FAM** — Projects tumor + normal features into shared space via SimSiam loss

---

## Tech Stack

| Category | Technology |
|:---------|:-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3.4 + Custom Glassmorphism |
| Components | shadcn/ui (Radix UI) |
| Animations | Framer Motion |
| Charts | Recharts |
| Routing | React Router v6 |
| State | TanStack React Query |
| Icons | Lucide React |
| Hosting | Vercel |

---

## Getting Started

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
# Clone
git clone https://github.com/ganesh2317/neuroscan-clarity.git
cd neuroscan-clarity

# Install
npm install

# Run
npm run dev
```

Open **http://localhost:5173** in your browser.

### Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint checks |
| `npm run test` | Run Vitest suite |

---

## Project Structure

```
src/
├── pages/
│   ├── Landing.tsx          # Hero, stats, how-it-works
│   ├── UploadPage.tsx       # 4-modality MRI upload
│   ├── ProcessingPage.tsx   # Real-time analysis animation
│   ├── ResultsPage.tsx      # Clinical results dashboard
│   ├── ArchitecturePage.tsx # Interactive model explorer
│   ├── DatasetPage.tsx      # Dataset & benchmark charts
│   └── AboutPage.tsx        # Research paper & citations
│
├── components/
│   ├── ui/                  # shadcn/ui base components
│   ├── results/             # MRIViewer, MetricsPanel, AttentionMaps
│   ├── GlassCard.tsx        # Glassmorphism card
│   ├── GlassNavbar.tsx      # Navigation bar
│   ├── AppSidebar.tsx       # Dashboard sidebar
│   └── AnimatedCounter.tsx  # Scroll-triggered counter
│
├── assets/                  # Brain MRI reference images
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
└── index.css                # Global styles & design tokens
```

---

## Research

Based on:

> **"Multimodal Brain Tumor Segmentation Boosted by Monomodal Normal Brain Images"**
>
> Liu, Ni, Nie, Shen, Wang, Tang — IEEE TIP, Vol. 33, 2024
>
> DOI: [10.1109/TIP.2024.3359815](https://doi.org/10.1109/TIP.2024.3359815)

### BraTS2022 Benchmark Results

| Region | Dice Score |
|:-------|:-----------|
| Whole Tumor (WT) | 92.9% |
| Tumor Core (TC) | 91.8% |
| Enhancing Tumor (ET) | 85.4% |

---

## Deployment

Deployed on **Vercel** with auto-deploy from `main` branch.

```bash
# Manual deploy
npm i -g vercel
vercel deploy --prod
```

🔗 **[neuroscan-clarity.vercel.app](https://neuroscan-clarity.vercel.app)**

---

## Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add my feature'`)
4. Push (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## Acknowledgements

- **Research:** Liu et al. — IEEE TIP 2024
- **Datasets:** BraTS2022, IXI, In-house GBM
- **UI:** shadcn/ui, Radix UI
- **Hosting:** Vercel

---

*Built for advancing medical imaging AI* ❤️
