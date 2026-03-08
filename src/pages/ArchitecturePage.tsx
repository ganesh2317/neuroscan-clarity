import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";

type DetailKey = "introvae" | "gcb" | "fam" | null;

const encoderPaths = ["T1", "T1c", "T2", "FLAIR"];
const channelLevels = [64, 128, 256, 512];

const details: Record<string, { title: string; content: React.ReactNode }> = {
  introvae: {
    title: "IntroVAE Detail",
    content: (
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-primary mb-2">Training Stage</h4>
          <p className="text-muted-foreground">IntroVAE trained on 581 T1 normal brain images from IXI dataset. Uses adversarial training with encoder and decoder playing a minimax game.</p>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-2">Loss Functions</h4>
          <div className="glass-card-sm !p-3 font-mono text-xs space-y-1">
            <div>L_Rec = ||I - I_R||₁ (Reconstruction)</div>
            <div>L_Reg = KL(q(z|I) || p(z)) (Regularization)</div>
            <div>z = μ + ε·σ (Reparameterization)</div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-2">Inference</h4>
          <p className="text-muted-foreground">Given tumor T1, encoder projects to latent z, decoder generates corresponding normal brain I_R. Parameters frozen during segmentation training.</p>
        </div>
      </div>
    ),
  },
  gcb: {
    title: "Global Correlation Block (GCB)",
    content: (
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-primary mb-2">Correlation Matrix</h4>
          <div className="glass-card-sm !p-3 font-mono text-xs">
            M_l^c = β · Q · K^T, where β = 1/√d
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-2">Weight Computation</h4>
          <div className="glass-card-sm !p-3 font-mono text-xs space-y-1">
            <div>ω_l^c(m) = softmax(mean(M_l^c(m)))</div>
            <div>f_l^c = Σ_m ω_l^c(m) · f_l^c(m)</div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-2">Behavior</h4>
          <p className="text-muted-foreground">At shallow levels: T2/FLAIR receive higher weights (edema). At deep levels: T1/T1c weighted more (enhancing core).</p>
        </div>
      </div>
    ),
  },
  fam: {
    title: "Feature Alignment Module (FAM)",
    content: (
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-primary mb-2">Part A: Feature Alignment</h4>
          <p className="text-muted-foreground">ζ and g (1×1 conv layers) project tumor features F_T,l and normal features F_R,l into shared space. SimSiam ensures normal-region consistency.</p>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-2">Part B: Feature Comparison</h4>
          <div className="glass-card-sm !p-3 font-mono text-xs">
            A_l = σ₂(ψ(σ₁(-ζ(F_T,l) · g(F_R,l))))
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-2">SimSiam Loss</h4>
          <p className="text-muted-foreground">Prevents feature collapse by ensuring that aligned features of normal regions remain consistent between tumor and normal reference images.</p>
        </div>
      </div>
    ),
  },
};

export default function ArchitecturePage() {
  const [activeDetail, setActiveDetail] = useState<DetailKey>(null);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold mb-2">Architecture Explorer</h1>
          <p className="text-muted-foreground mb-8">Interactive visualization of the full segmentation framework</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Segmentation Backbone */}
          <div className="lg:col-span-2">
            <GlassCard className="border-primary/20">
              <h3 className="font-heading font-semibold text-primary mb-4">Segmentation Backbone</h3>

              {/* Multi-encoder */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Multi-Encoder (4 parallel pathways)</h4>
                <div className="space-y-2">
                  {encoderPaths.map((path, pi) => (
                    <div key={path} className="flex items-center gap-2">
                      <span className="text-xs w-10 text-primary font-semibold">{path}</span>
                      <div className="flex-1 flex gap-1">
                        {channelLevels.map((ch, ci) => (
                          <motion.div
                            key={ch}
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: pi * 0.1 + ci * 0.05 }}
                            className="flex-1 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary/70 hover:bg-primary/20 transition-colors cursor-default"
                          >
                            {ch}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* GCB nodes */}
                <div className="flex gap-1 mt-2 ml-12">
                  {channelLevels.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveDetail("gcb")}
                      className="flex-1 h-6 rounded bg-warning/10 border border-warning/20 flex items-center justify-center text-[9px] text-warning hover:bg-warning/20 transition-colors cursor-pointer"
                    >
                      GCB
                    </button>
                  ))}
                </div>
              </div>

              {/* Decoder + FAM */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Decoder with FAM</h4>
                <div className="flex gap-2">
                  {[512, 256, 128, 64].map((ch, i) => (
                    <div key={i} className="flex-1 space-y-1">
                      <div className="h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] text-accent/70">
                        {ch}
                      </div>
                      <button
                        onClick={() => setActiveDetail("fam")}
                        className="w-full h-5 rounded bg-accent/5 border border-accent/15 flex items-center justify-center text-[9px] text-accent hover:bg-accent/15 transition-colors cursor-pointer"
                      >
                        A{i + 1}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground text-center">Click GCB or FAM nodes for details</div>
            </GlassCard>
          </div>

          {/* Normal Appearance Network */}
          <div>
            <GlassCard className="border-accent/20 mb-4">
              <h3 className="font-heading font-semibold text-accent mb-4">Normal Appearance Network</h3>
              <button onClick={() => setActiveDetail("introvae")} className="w-full">
                <div className="glass-card-sm !p-4 mb-3 border-accent/20 hover:bg-accent/10 transition-colors cursor-pointer">
                  <div className="text-sm font-medium mb-1">IntroVAE</div>
                  <div className="text-xs text-muted-foreground">T1 tumor → Normal I_R</div>
                </div>
              </button>
              <div className="text-xs text-muted-foreground text-center">↓ Normal features F_R</div>
              <div className="mt-3 space-y-1">
                {[1, 2, 3, 4].map((l) => (
                  <div key={l} className="glass-card-sm !p-2 text-[10px] text-accent/70 text-center">
                    F_R,{l} → FAM Level {l}
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="!p-4">
              <h4 className="font-heading font-semibold text-sm mb-2">Quick Summary</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>• 4 modality encoders with GCB fusion</li>
                <li>• IntroVAE generates normal brain reference</li>
                <li>• FAM aligns & compares features at 4 levels</li>
                <li>• SimSiam prevents feature collapse</li>
                <li>• Decoder outputs 3-class segmentation map</li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {activeDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
              onClick={() => setActiveDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card max-w-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold">{details[activeDetail].title}</h3>
                  <button onClick={() => setActiveDetail(null)} className="text-muted-foreground hover:text-foreground p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {details[activeDetail].content}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
