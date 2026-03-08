import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";
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

const tabs = ["T1", "T1c", "T2", "FLAIR", "Normal (IntroVAE)", "Segmentation"];

interface TumorRegion {
  id: string;
  label: string;
  type: "Edema" | "Enhancing Core" | "Necrosis";
  x: number; // percentage
  y: number;
  w: number;
  h: number;
  details: {
    volume: string;
    grade: string;
    confidence: string;
    location: string;
    density: string;
  };
}

const tumorRegions: TumorRegion[] = [
  {
    id: "edema",
    label: "Perilesional Edema",
    type: "Edema",
    x: 52, y: 28, w: 28, h: 24,
    details: {
      volume: "24.8 cm³",
      grade: "Grade IV — GBM",
      confidence: "96.2%",
      location: "Right Temporal Lobe",
      density: "Hypointense T1 / Hyperintense T2",
    },
  },
  {
    id: "core",
    label: "Enhancing Tumor Core",
    type: "Enhancing Core",
    x: 58, y: 34, w: 16, h: 14,
    details: {
      volume: "11.9 cm³",
      grade: "Active Enhancement",
      confidence: "98.1%",
      location: "Right Temporal — Deep White Matter",
      density: "Ring-enhancing on T1c",
    },
  },
  {
    id: "necrosis",
    label: "Necrotic Core",
    type: "Necrosis",
    x: 62, y: 38, w: 8, h: 7,
    details: {
      volume: "5.97 cm³",
      grade: "Central Necrosis",
      confidence: "94.8%",
      location: "Central Tumor Region",
      density: "Hypointense on all sequences",
    },
  },
];

const regionColors: Record<string, { border: string; bg: string; text: string }> = {
  Edema: { border: "border-warning", bg: "bg-warning/10", text: "text-warning" },
  "Enhancing Core": { border: "border-primary", bg: "bg-primary/10", text: "text-primary" },
  Necrosis: { border: "border-destructive", bg: "bg-destructive/10", text: "text-destructive" },
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 4));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setSelectedRegion(null); };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((z) => Math.max(0.5, Math.min(4, z + delta)));
  }, []);

  return (
    <GlassCard className="mb-4 relative">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSelectedRegion(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Image Viewer */}
      <div
        ref={containerRef}
        className="relative aspect-square rounded-xl bg-background border border-white/5 overflow-hidden mb-4 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute inset-0 transition-transform duration-100"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          <img
            src={imageMap[activeTab]}
            alt={`Brain MRI — ${activeTab}`}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Tumor detection boxes */}
          {showOverlay && activeTab === "Segmentation" && tumorRegions.map((region) => {
            const colors = regionColors[region.type];
            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute border-2 ${colors.border} cursor-pointer transition-all hover:border-opacity-100 ${
                  selectedRegion?.id === region.id ? "border-opacity-100 shadow-lg" : "border-opacity-60"
                }`}
                style={{
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: `${region.w}%`,
                  height: `${region.h}%`,
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedRegion(region); }}
              >
                {/* Corner brackets */}
                <div className={`absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 ${colors.border}`} />
                <div className={`absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 ${colors.border}`} />
                <div className={`absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 ${colors.border}`} />
                <div className={`absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 ${colors.border}`} />
                
                {/* Label */}
                <div className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[9px] font-medium whitespace-nowrap ${colors.bg} ${colors.text}`}>
                  {region.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tumor Detail Panel — Top Right */}
        <AnimatePresence>
          {selectedRegion && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-3 right-3 w-56 z-20"
            >
              <div className="glass rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${regionColors[selectedRegion.type].text}`}>
                    {selectedRegion.label}
                  </span>
                  <button onClick={() => setSelectedRegion(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(selectedRegion.details).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-medium text-foreground text-right max-w-[120px]">{val}</span>
                    </div>
                  ))}
                </div>
                <div className={`h-1 rounded-full mt-2 ${regionColors[selectedRegion.type].bg}`}>
                  <div
                    className={`h-full rounded-full transition-all`}
                    style={{
                      width: selectedRegion.details.confidence,
                      backgroundColor: selectedRegion.type === "Edema" ? "hsl(var(--warning))" :
                        selectedRegion.type === "Enhancing Core" ? "hsl(var(--primary))" : "hsl(var(--destructive))",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slice indicator */}
        <div className="absolute bottom-3 left-3 text-xs text-muted-foreground glass-card-sm !p-2 z-10">
          Slice {slice}/128
        </div>

        {/* Zoom indicator */}
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground glass-card-sm !p-2 z-10">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setShowOverlay(!showOverlay)} className="btn-glass-outline !py-2 !px-3 text-xs inline-flex items-center gap-1">
          {showOverlay ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showOverlay ? "Hide" : "Show"}
        </button>
        <div className="flex items-center gap-1">
          <button onClick={handleZoomOut} className="btn-glass-outline !p-2"><ZoomOut className="w-3.5 h-3.5" /></button>
          <button onClick={handleZoomIn} className="btn-glass-outline !p-2"><ZoomIn className="w-3.5 h-3.5" /></button>
          <button onClick={handleReset} className="btn-glass-outline !p-2"><RotateCcw className="w-3.5 h-3.5" /></button>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <span className="text-[10px] text-muted-foreground">Slice</span>
          <input type="range" min={1} max={128} value={slice} onChange={(e) => setSlice(Number(e.target.value))}
            className="flex-1 accent-primary h-1" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
        {[
          { label: "Edema (WT)", color: "bg-warning" },
          { label: "Enhancing Core", color: "bg-primary" },
          { label: "Necrosis", color: "bg-destructive" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-3 h-3 rounded-sm ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
