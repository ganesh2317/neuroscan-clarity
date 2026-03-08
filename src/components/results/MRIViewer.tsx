import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, X, Crosshair, Ruler, Info, Layers, Move } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

import brainT1 from "@/assets/brain-mri-t1.jpg";
import brainT1c from "@/assets/brain-mri-t1c.jpg";
import brainT2 from "@/assets/brain-mri-t2.jpg";
import brainFlair from "@/assets/brain-mri-flair.jpg";
import brainNormal from "@/assets/brain-mri-normal.jpg";
import brainSeg from "@/assets/brain-mri-segmentation.jpg";

const imageMap: Record<string, string> = {
  T1: brainT1,
  T1c: brainT1c,
  T2: brainT2,
  FLAIR: brainFlair,
  "Normal (IntroVAE)": brainNormal,
  Segmentation: brainSeg,
};

const modalityInfo: Record<string, { full: string; desc: string }> = {
  T1: { full: "T1-Weighted", desc: "Structural anatomy · Gray/white matter contrast" },
  T1c: { full: "T1 Contrast-Enhanced", desc: "Gadolinium · Ring-enhancing tumor core" },
  T2: { full: "T2-Weighted", desc: "Edema visualization · Hyperintense fluid" },
  FLAIR: { full: "Fluid-Attenuated IR", desc: "Suppressed CSF · Whole tumor boundary" },
  "Normal (IntroVAE)": { full: "IntroVAE Reconstruction", desc: "Normal reference brain · z = μ + ε·σ" },
  Segmentation: { full: "AI Segmentation Mask", desc: "FAM+GCB output · 3 tumor sub-regions" },
};

const tabs = ["T1", "T1c", "T2", "FLAIR", "Normal (IntroVAE)", "Segmentation"];

interface TumorRegion {
  id: string;
  label: string;
  type: "Edema" | "Enhancing Core" | "Necrosis";
  x: number;
  y: number;
  w: number;
  h: number;
  details: {
    classification: string;
    volume: string;
    confidence: string;
    location: string;
    signal: string;
    who_grade: string;
    ki67: string;
    mgmt: string;
  };
}

const tumorRegions: TumorRegion[] = [
  {
    id: "edema",
    label: "Perilesional Edema (WT)",
    type: "Edema",
    x: 42, y: 22, w: 36, h: 32,
    details: {
      classification: "Vasogenic Edema",
      volume: "24.83 cm³",
      confidence: "96.2%",
      location: "R. Temporal-Parietal, extending to insular cortex",
      signal: "T1 hypointense · T2/FLAIR hyperintense",
      who_grade: "—",
      ki67: "—",
      mgmt: "—",
    },
  },
  {
    id: "core",
    label: "Enhancing Tumor Core (TC)",
    type: "Enhancing Core",
    x: 50, y: 30, w: 22, h: 18,
    details: {
      classification: "Glioblastoma Multiforme (GBM)",
      volume: "11.94 cm³",
      confidence: "98.1%",
      location: "R. Temporal Lobe — Deep White Matter",
      signal: "Ring-enhancing on T1c · Central necrosis",
      who_grade: "WHO Grade IV",
      ki67: "~30-40% (estimated)",
      mgmt: "Methylated (favorable)",
    },
  },
  {
    id: "necrosis",
    label: "Necrotic Core (NET)",
    type: "Necrosis",
    x: 56, y: 35, w: 10, h: 9,
    details: {
      classification: "Central Tumor Necrosis",
      volume: "5.97 cm³",
      confidence: "94.8%",
      location: "Central within enhancing rim",
      signal: "Hypointense all sequences · No enhancement",
      who_grade: "—",
      ki67: "—",
      mgmt: "—",
    },
  },
];

const regionStyles: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  Edema: { border: "rgba(255,215,64,0.7)", bg: "bg-warning/10", text: "text-warning", glow: "0 0 8px rgba(255,215,64,0.3)" },
  "Enhancing Core": { border: "rgba(79,195,247,0.8)", bg: "bg-primary/10", text: "text-primary", glow: "0 0 8px rgba(79,195,247,0.3)" },
  Necrosis: { border: "rgba(255,82,82,0.7)", bg: "bg-destructive/10", text: "text-destructive", glow: "0 0 8px rgba(255,82,82,0.3)" },
};

export function MRIViewer() {
  const [activeTab, setActiveTab] = useState("Segmentation");
  const [showOverlay, setShowOverlay] = useState(true);
  const [slice, setSlice] = useState(64);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedRegion, setSelectedRegion] = useState<TumorRegion | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCrosshair, setShowCrosshair] = useState(true);
  const [windowLevel, setWindowLevel] = useState({ w: 400, l: 40 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setSelectedRegion(null); };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursorPos({
        x: Math.round(((e.clientX - rect.left) / rect.width) * 240),
        y: Math.round(((e.clientY - rect.top) / rect.height) * 240),
      });
    }
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.shiftKey) {
      // Shift+scroll = change slice
      setSlice((s) => Math.max(1, Math.min(128, s + (e.deltaY > 0 ? -1 : 1))));
    } else {
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      setZoom((z) => Math.max(0.5, Math.min(5, z + delta)));
    }
  }, []);

  const currentInfo = modalityInfo[activeTab];

  return (
    <div className="space-y-3">
      {/* DICOM-style header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide">MRI VIEWER</h2>
          <p className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">
            {currentInfo.full} — {currentInfo.desc}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowCrosshair(!showCrosshair)}
            className={`p-1.5 rounded-md transition-all ${showCrosshair ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            title="Toggle crosshair"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`p-1.5 rounded-md transition-all ${showOverlay ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            title="Toggle segmentation overlay"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modality tabs */}
      <div className="flex gap-0.5 bg-secondary/30 rounded-lg p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedRegion(null); }}
            className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-semibold tracking-wide transition-all ${
              activeTab === tab
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "Normal (IntroVAE)" ? "NORMAL" : tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main viewer */}
      <div className="relative">
        <div
          ref={containerRef}
          className="relative aspect-square rounded-lg bg-black border border-white/8 overflow-hidden cursor-crosshair select-none"
          style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Image layer */}
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isPanning ? "none" : "transform 0.15s ease-out",
            }}
          >
            <img
              src={imageMap[activeTab]}
              alt={`Brain MRI — ${activeTab}`}
              className="w-full h-full object-contain"
              draggable={false}
              style={{
                filter: `brightness(${0.8 + windowLevel.l / 200}) contrast(${0.5 + windowLevel.w / 400})`,
              }}
            />

            {/* Tumor bounding boxes */}
            {showOverlay && activeTab === "Segmentation" && tumorRegions.map((region) => {
              const styles = regionStyles[region.type];
              const isSelected = selectedRegion?.id === region.id;
              return (
                <div
                  key={region.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    width: `${region.w}%`,
                    height: `${region.h}%`,
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedRegion(region); }}
                >
                  {/* Main border */}
                  <div
                    className="absolute inset-0 transition-all"
                    style={{
                      border: `1.5px solid ${styles.border}`,
                      boxShadow: isSelected ? styles.glow : "none",
                      opacity: isSelected ? 1 : 0.65,
                    }}
                  />
                  {/* Corner markers - medical imaging style */}
                  {[
                    { pos: "-top-px -left-px", border: "border-t border-l" },
                    { pos: "-top-px -right-px", border: "border-t border-r" },
                    { pos: "-bottom-px -left-px", border: "border-b border-l" },
                    { pos: "-bottom-px -right-px", border: "border-b border-r" },
                  ].map((corner, i) => (
                    <div
                      key={i}
                      className={`absolute ${corner.pos} w-2.5 h-2.5`}
                      style={{ borderColor: styles.border, borderWidth: "2px", borderStyle: "solid",
                        borderTop: corner.border.includes("border-t") ? undefined : "none",
                        borderBottom: corner.border.includes("border-b") ? undefined : "none",
                        borderLeft: corner.border.includes("border-l") ? undefined : "none",
                        borderRight: corner.border.includes("border-r") ? undefined : "none",
                      }}
                    />
                  ))}
                  {/* Label tag */}
                  <div
                    className="absolute -top-5 left-0 px-1 py-px text-[8px] font-mono font-bold tracking-wider whitespace-nowrap rounded-sm"
                    style={{
                      backgroundColor: styles.border,
                      color: "#000",
                    }}
                  >
                    {region.type === "Edema" ? "WT" : region.type === "Enhancing Core" ? "TC" : "NET"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Crosshair overlay */}
          {showCrosshair && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/20" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20" />
            </div>
          )}

          {/* DICOM-style corner annotations */}
          <div className="absolute top-2 left-2 text-[9px] font-mono text-muted-foreground/70 leading-tight z-10">
            <div>PT-2024-0847</div>
            <div>2024-03-15 14:22:38</div>
            <div className="text-primary/70">{currentInfo.full}</div>
          </div>
          <div className="absolute top-2 right-2 text-[9px] font-mono text-muted-foreground/70 text-right leading-tight z-10">
            <div>240×240×128</div>
            <div>Slice: {slice}/128</div>
            <div>WL: {windowLevel.w}/{windowLevel.l}</div>
          </div>
          <div className="absolute bottom-2 left-2 text-[9px] font-mono text-muted-foreground/70 z-10">
            <div>Pos: ({cursorPos.x}, {cursorPos.y})</div>
            <div>Zoom: {Math.round(zoom * 100)}%</div>
          </div>
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-muted-foreground/70 text-right z-10">
            <div>NeuroScan AI v2.4</div>
            <div>FAM+GCB Pipeline</div>
          </div>

          {/* Orientation markers */}
          <div className="absolute top-1/2 left-1 -translate-y-1/2 text-[9px] font-mono font-bold text-muted-foreground/40 z-10">R</div>
          <div className="absolute top-1/2 right-1 -translate-y-1/2 text-[9px] font-mono font-bold text-muted-foreground/40 z-10">L</div>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-muted-foreground/40 z-10">A</div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-muted-foreground/40 z-10">P</div>
        </div>

        {/* Tumor Detail Panel — Top Right (floating over viewer) */}
        <AnimatePresence>
          {selectedRegion && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-2 right-2 w-64 z-30"
            >
              <div className="bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className={`text-[10px] font-mono font-bold tracking-wider ${regionStyles[selectedRegion.type].text}`}>
                      {selectedRegion.type === "Edema" ? "WHOLE TUMOR" : selectedRegion.type === "Enhancing Core" ? "TUMOR CORE" : "NECROTIC CORE"}
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">{selectedRegion.label}</div>
                  </div>
                  <button onClick={() => setSelectedRegion(null)} className="text-muted-foreground hover:text-foreground p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Confidence bar */}
                <div className="mb-2.5">
                  <div className="flex justify-between text-[9px] mb-1">
                    <span className="text-muted-foreground font-mono">CONFIDENCE</span>
                    <span className={`font-bold ${regionStyles[selectedRegion.type].text}`}>
                      {selectedRegion.details.confidence}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: selectedRegion.details.confidence }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: selectedRegion.type === "Edema" ? "hsl(var(--warning))" :
                          selectedRegion.type === "Enhancing Core" ? "hsl(var(--primary))" : "hsl(var(--destructive))",
                      }}
                    />
                  </div>
                </div>

                {/* Data grid */}
                <div className="space-y-1.5 border-t border-white/5 pt-2">
                  {[
                    { k: "Classification", v: selectedRegion.details.classification },
                    { k: "Volume", v: selectedRegion.details.volume },
                    { k: "Location", v: selectedRegion.details.location },
                    { k: "Signal Pattern", v: selectedRegion.details.signal },
                    ...(selectedRegion.details.who_grade !== "—" ? [
                      { k: "WHO Grade", v: selectedRegion.details.who_grade },
                      { k: "Ki-67 Index", v: selectedRegion.details.ki67 },
                      { k: "MGMT Status", v: selectedRegion.details.mgmt },
                    ] : []),
                  ].map((item) => (
                    <div key={item.k} className="flex justify-between gap-2">
                      <span className="text-[9px] text-muted-foreground font-mono shrink-0">{item.k}</span>
                      <span className="text-[9px] font-medium text-right leading-tight">{item.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls bar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 bg-secondary/30 rounded-md p-0.5">
          <button onClick={handleZoomOut} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-0.5" />
          <button onClick={handleReset} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors" title="Reset view">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Slice slider */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[9px] font-mono text-muted-foreground whitespace-nowrap">SLICE</span>
          <input
            type="range"
            min={1}
            max={128}
            value={slice}
            onChange={(e) => setSlice(Number(e.target.value))}
            className="flex-1 accent-primary h-1 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-muted-foreground w-12 text-right">{slice}/128</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 border-t border-white/5">
        {[
          { label: "Edema (WT)", color: "bg-warning" },
          { label: "Enhancing Core (TC)", color: "bg-primary" },
          { label: "Necrotic Core (NET)", color: "bg-destructive" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <div className={`w-2 h-2 rounded-[2px] ${item.color}`} />
            {item.label}
          </div>
        ))}
        <div className="ml-auto text-[9px] text-muted-foreground/50 font-mono">
          Shift+Scroll = slice · Scroll = zoom
        </div>
      </div>
    </div>
  );
}
