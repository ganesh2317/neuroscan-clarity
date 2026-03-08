import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

import attL1 from "@/assets/brain-attention-l1.jpg";
import attL2 from "@/assets/brain-attention-l2.jpg";
import attL3 from "@/assets/brain-attention-l3.jpg";
import attL4 from "@/assets/brain-attention-l4.jpg";

const levels = [
  { level: 1, label: "Level 1 — Coarse", desc: "Low-resolution global attention, highlights broad tumor region", image: attL1, resolution: "16×16", channels: 512 },
  { level: 2, label: "Level 2 — Mid", desc: "Medium-resolution attention, captures tumor boundaries and edema spread", image: attL2, resolution: "32×32", channels: 256 },
  { level: 3, label: "Level 3 — Mid-Fine", desc: "Higher-resolution attention on tumor core structures", image: attL3, resolution: "64×64", channels: 128 },
  { level: 4, label: "Level 4 — Fine", desc: "Fine-grained pixel-level attention for precise segmentation boundaries", image: attL4, resolution: "128×128", channels: 64 },
];

export function AttentionMaps() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6">
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-semibold">Attention Maps (FAM)</h3>
            <p className="text-xs text-muted-foreground mt-1">Feature Alignment Module attention at each decoder level — A<sub>l</sub> = σ₂(ψ(σ₁(−ζ(F<sub>T,l</sub>) · g(F<sub>R,l</sub>))))</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {levels.map((item) => (
            <motion.div
              key={item.level}
              className="text-center group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setExpanded(item.level)}
            >
              <div className="relative aspect-square rounded-xl border border-white/10 overflow-hidden mb-2">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-all flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-foreground opacity-0 group-hover:opacity-80 transition-opacity" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 glass-card-sm !p-1.5 text-[9px] text-muted-foreground">
                  {item.resolution} · {item.channels}ch
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Expanded view */}
        <AnimatePresence>
          {expanded !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              onClick={() => setExpanded(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="glass rounded-2xl p-6 max-w-lg w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading font-semibold">{levels[expanded - 1].label}</h4>
                  <button onClick={() => setExpanded(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden border border-white/10 mb-4">
                  <img src={levels[expanded - 1].image} alt={levels[expanded - 1].label} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{levels[expanded - 1].desc}</p>
                <div className="flex gap-4 text-xs">
                  <div className="glass-card-sm !p-2 flex-1 text-center">
                    <div className="text-muted-foreground">Resolution</div>
                    <div className="font-semibold">{levels[expanded - 1].resolution}</div>
                  </div>
                  <div className="glass-card-sm !p-2 flex-1 text-center">
                    <div className="text-muted-foreground">Channels</div>
                    <div className="font-semibold">{levels[expanded - 1].channels}</div>
                  </div>
                  <div className="glass-card-sm !p-2 flex-1 text-center">
                    <div className="text-muted-foreground">Attention</div>
                    <div className="font-semibold text-accent">{expanded === 1 ? "Global" : expanded === 4 ? "Precise" : "Regional"}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
