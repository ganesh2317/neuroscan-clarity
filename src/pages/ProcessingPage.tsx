import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";
import { useNavigate } from "react-router-dom";

type StepStatus = "pending" | "active" | "complete";

interface PipelineStep {
  title: string;
  details: string[];
  visualType: "bars" | "sideBySide" | "levels" | "weights" | "attention" | "output";
}

const pipelineSteps: PipelineStep[] = [
  {
    title: "Pre-processing",
    details: ["Skull stripping and normalization", "Resize to 128×128 slices", "2.5D slice extraction (center + 2 neighboring = 5 slices)"],
    visualType: "bars",
  },
  {
    title: "IntroVAE: Normal Brain Generation",
    details: ["T1 tumor image → Encoder → latent z = μ + ε·σ", "Decoder reconstructs normal T1 brain image I_R", "Normal appearance used as reference for comparison"],
    visualType: "sideBySide",
  },
  {
    title: "Multi-Encoder Feature Extraction",
    details: ["4 separate encoders: T1, T1c, T2, FLAIR", "Conv layers: 3×3 kernel, stride 2", "Channels: 64 → 128 → 256 → 512"],
    visualType: "levels",
  },
  {
    title: "Global Correlation Block (GCB) Fusion",
    details: ["Self-attention correlation: M = β·Q·K", "Assigns modality weights per level", "T2/FLAIR weighted at low levels, T1/T1c at deep"],
    visualType: "weights",
  },
  {
    title: "Feature Alignment Module (FAM)",
    details: ["ζ and g (1×1 conv) align tumor & normal features", "SimSiam prevents feature collapse", "Attention map A_l via dot-product soft-attention"],
    visualType: "attention",
  },
  {
    title: "Segmentation Output",
    details: ["Decoder produces probability maps", "Three ROIs: Edema / Enhancing Core / Necrosis", "Softmax generates per-class probability"],
    visualType: "output",
  },
];

function StepVisual({ type, active }: { type: string; active: boolean }) {
  if (!active) return null;
  
  if (type === "bars") {
    return (
      <div className="flex gap-2 mt-3">
        {["Skull Strip", "Normalize", "Resize", "Extract"].map((s, i) => (
          <motion.div key={s} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: i * 0.3, duration: 0.5 }} className="flex-1">
            <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
            <span className="text-[10px] text-muted-foreground mt-1 block">{s}</span>
          </motion.div>
        ))}
      </div>
    );
  }
  
  if (type === "sideBySide") {
    return (
      <div className="flex gap-4 mt-3">
        {["Tumor T1 Input", "Reconstructed Normal"].map((label, i) => (
          <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.3 }}
            className="flex-1 h-24 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border border-white/10">
            <span className="text-xs text-muted-foreground">{label}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "levels") {
    return (
      <div className="space-y-2 mt-3">
        {[64, 128, 256, 512].map((ch, i) => (
          <div key={ch} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-16">Ch: {ch}</span>
            <motion.div initial={{ width: 0 }} animate={{ width: `${25 + i * 25}%` }} transition={{ delay: i * 0.2, duration: 0.6 }}
              className="h-3 rounded-full bg-gradient-to-r from-primary/60 to-primary" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "weights") {
    const mods = [
      { name: "T1", weights: [0.2, 0.25, 0.35, 0.45] },
      { name: "T1c", weights: [0.2, 0.3, 0.4, 0.5] },
      { name: "T2", weights: [0.5, 0.4, 0.25, 0.15] },
      { name: "FLAIR", weights: [0.6, 0.45, 0.3, 0.1] },
    ];
    return (
      <div className="space-y-2 mt-3">
        {mods.map((mod, i) => (
          <div key={mod.name} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-12">{mod.name}</span>
            <div className="flex-1 flex gap-1">
              {mod.weights.map((w, j) => (
                <motion.div key={j} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + j * 0.1 }}
                  className="flex-1 rounded" style={{ height: 12, backgroundColor: `rgba(79,195,247,${w})` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "attention") {
    return (
      <div className="grid grid-cols-4 gap-2 mt-3">
        {[1, 2, 3, 4].map((level) => (
          <motion.div key={level} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: level * 0.15 }}
            className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-white/10">
            <span className="text-[10px] text-muted-foreground">A{level}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 h-20 rounded-xl bg-gradient-to-r from-accent/10 via-primary/10 to-warning/10 flex items-center justify-center border border-white/10">
      <span className="text-sm text-accent font-medium">Segmentation Complete ✓</span>
    </motion.div>
  );
}

export default function ProcessingPage() {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<StepStatus[]>(pipelineSteps.map(() => "pending"));
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let i = 0;
    const next = () => {
      if (i >= pipelineSteps.length) {
        setTimeout(() => navigate("/results"), 1500);
        return;
      }
      setStatuses((prev) => prev.map((s, idx) => (idx === i ? "active" : s)));
      setExpanded((prev) => ({ ...prev, [i]: true }));
      const dur = 2000 + Math.random() * 1500;
      setTimeout(() => {
        setStatuses((prev) => prev.map((s, idx) => (idx === i ? "complete" : s)));
        i++;
        setTimeout(next, 300);
      }, dur);
    };
    setTimeout(next, 500);
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold mb-2">Processing Pipeline</h1>
          <p className="text-muted-foreground mb-8">Running AI segmentation pipeline on your MRI data</p>
        </motion.div>

        <div className="space-y-4 relative">
          {/* Connecting line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />

          {pipelineSteps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className={`relative pl-14 ${statuses[i] === "active" ? "border-primary/30 glow-primary" : ""}`}>
                {/* Step indicator */}
                <div className="absolute left-4 top-6">
                  {statuses[i] === "complete" ? (
                    <CheckCircle className="w-6 h-6 text-accent" />
                  ) : statuses[i] === "active" ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground/30" />
                  )}
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-semibold flex items-center gap-2">
                      <span className="text-xs text-primary/60">Step {i + 1}</span>
                      {step.title}
                    </h3>
                  </div>
                  <button onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))} className="text-muted-foreground hover:text-foreground p-1">
                    {expanded[i] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {expanded[i] && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                    <ul className="space-y-1">
                      {step.details.map((d, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary/40 mt-1">•</span> {d}
                        </li>
                      ))}
                    </ul>
                    <StepVisual type={step.visualType} active={statuses[i] === "active" || statuses[i] === "complete"} />
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
