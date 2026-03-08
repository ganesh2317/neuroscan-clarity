import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Info } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

import attL1 from "@/assets/brain-attention-l1.jpg";
import attL2 from "@/assets/brain-attention-l2.jpg";
import attL3 from "@/assets/brain-attention-l3.jpg";
import attL4 from "@/assets/brain-attention-l4.jpg";

const levels = [
  {
    level: 1,
    label: "Level 1 — Coarse",
    tag: "A₁",
    desc: "Low-resolution global attention captures broad anatomical context. At 16×16 spatial resolution with 512 channels, this level identifies the general tumor hemisphere and approximate location within the brain volume.",
    image: attL1,
    resolution: "16×16",
    channels: 512,
    receptiveField: "Global",
    modalityWeight: "T2/FLAIR dominant",
    attentionScore: 0.72,
  },
  {
    level: 2,
    label: "Level 2 — Mid",
    tag: "A₂",
    desc: "Medium-resolution attention begins focusing on tumor-specific regions. The 32×32 feature map captures the perilesional edema boundary and differentiates tumor tissue from normal parenchyma.",
    image: attL2,
    resolution: "32×32",
    channels: 256,
    receptiveField: "Regional",
    modalityWeight: "Balanced",
    attentionScore: 0.84,
  },
  {
    level: 3,
    label: "Level 3 — Mid-Fine",
    tag: "A₃",
    desc: "Higher-resolution attention at 64×64 delineates tumor core boundaries. SimSiam alignment ensures normal-region features are suppressed, amplifying the contrast at enhancing tumor margins.",
    image: attL3,
    resolution: "64×64",
    channels: 128,
    receptiveField: "Local",
    modalityWeight: "T1c dominant",
    attentionScore: 0.91,
  },
  {
    level: 4,
    label: "Level 4 — Fine",
    tag: "A₄",
    desc: "Pixel-level fine-grained attention at full 128×128 resolution. This level provides the precise segmentation boundary used for the final probability map, capturing subtle enhancing rims and necrotic core transitions.",
    image: attL4,
    resolution: "128×128",
    channels: 64,
    receptiveField: "Pixel-level",
    modalityWeight: "T1/T1c dominant",
    attentionScore: 0.96,
  },
];

export function AttentionMaps() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6">
      <GlassCard hover={false}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[11px] font-mono font-bold tracking-wider text-muted-foreground">FEATURE ALIGNMENT MODULE — ATTENTION MAPS</h3>
        </div>
        <p className="text-[9px] text-muted-foreground/70 font-mono mb-4">
          A<sub>l</sub> = σ₂(ψ(σ₁(−ζ(F<sub>T,l</sub>) · g(F<sub>R,l</sub>)))) — Dot-product soft-attention between tumor and normal features at each decoder level
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {levels.map((item) => (
            <motion.div
              key={item.level}
              className="group cursor-pointer"
              whileHover={{ y: -2 }}
              onClick={() => setExpanded(item.level)}
            >
              <div className="relative aspect-square rounded-lg border border-white/8 overflow-hidden bg-black">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-all flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-foreground opacity-0 group-hover:opacity-90 transition-opacity" />
                </div>
                {/* Level badge */}
                <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-primary">
                  {item.tag}
                </div>
                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-4">
                  <div className="text-[8px] font-mono text-white/80">{item.resolution} · {item.channels}ch</div>
                </div>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-mono">{item.label}</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${item.attentionScore * 100}%` }} />
                  </div>
                  <span className="text-[8px] font-mono text-primary">{item.attentionScore.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded modal */}
        <AnimatePresence>
          {expanded !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md"
              onClick={() => setExpanded(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 max-w-xl w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-sm">{levels[expanded - 1].label}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Decoder Level {expanded} Attention Map</p>
                  </div>
                  <button onClick={() => setExpanded(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-white/5">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="aspect-square rounded-xl overflow-hidden border border-white/8 mb-4 bg-black">
                  <img src={levels[expanded - 1].image} alt={levels[expanded - 1].label} className="w-full h-full object-cover" />
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{levels[expanded - 1].desc}</p>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Resolution", value: levels[expanded - 1].resolution },
                    { label: "Channels", value: String(levels[expanded - 1].channels) },
                    { label: "Receptive Field", value: levels[expanded - 1].receptiveField },
                    { label: "Modality Bias", value: levels[expanded - 1].modalityWeight },
                  ].map((item) => (
                    <div key={item.label} className="bg-secondary/20 rounded-lg p-2 text-center">
                      <div className="text-[10px] font-bold font-mono">{item.value}</div>
                      <div className="text-[8px] text-muted-foreground font-mono mt-0.5">{item.label.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
