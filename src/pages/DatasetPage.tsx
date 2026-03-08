import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const compChart = [
  { method: "V-Net", wt: 0.891, color: "#ffffff20" },
  { method: "Att U-Net", wt: 0.903, color: "#ffffff20" },
  { method: "nnU-Net", wt: 0.918, color: "#ffffff20" },
  { method: "UNETR", wt: 0.912, color: "#ffffff20" },
  { method: "nnFormer", wt: 0.921, color: "#ffffff20" },
  { method: "TransBTS", wt: 0.916, color: "#ffffff20" },
  { method: "Ours", wt: 0.929, color: "#4fc3f7" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { delay, duration: 0.5 },
});

export default function DatasetPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold mb-2">Dataset & Training</h1>
          <p className="text-muted-foreground mb-8">Data sources, configurations, and benchmark results</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* BraTS2022 */}
          <GlassCard {...fadeUp(0)}>
            <h3 className="font-heading font-semibold text-lg mb-4 text-primary">BraTS2022 Dataset</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Patients</span><span className="font-semibold"><AnimatedCounter end={1251} /></span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Modalities</span><span className="font-semibold">T1, T1c, T2, FLAIR</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tumor ROIs</span><span className="font-semibold">Edema, Core, Necrosis</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Split</span><span className="font-semibold">70/10/20</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Input</span><span className="font-semibold">2.5D (5 slices, K=2)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Hardware</span><span className="font-semibold">RTX 3090</span></div>
            </div>
          </GlassCard>

          {/* In-house */}
          <GlassCard {...fadeUp(0.1)}>
            <h3 className="font-heading font-semibold text-lg mb-4 text-accent">In-house GBM Dataset</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Patients</span><span className="font-semibold"><AnimatedCounter end={104} /></span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Modalities</span><span className="font-semibold">T1c, B0, MD, FA</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="font-semibold">DWI-derived</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Age</span><span className="font-semibold">51.6 ± 14.6 years</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gender</span><span className="font-semibold">36F / 68M</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Locations</span><span className="font-semibold text-xs">Parietal, Frontal, Temporal...</span></div>
            </div>
          </GlassCard>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* IXI */}
          <GlassCard {...fadeUp(0.2)}>
            <h3 className="font-heading font-semibold text-lg mb-4 text-warning">IXI Dataset (IntroVAE)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Images</span><span className="font-semibold"><AnimatedCounter end={581} /> T1 MR</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Subjects</span><span className="font-semibold">Healthy controls</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Purpose</span><span className="font-semibold">Train IntroVAE</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Integration</span><span className="font-semibold">Params frozen</span></div>
            </div>
          </GlassCard>

          {/* Training Config */}
          <GlassCard {...fadeUp(0.3)}>
            <h3 className="font-heading font-semibold text-lg mb-4">Training Configuration</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Seg. Loss</span><span className="font-semibold">Dice Loss</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">FAM Loss</span><span className="font-semibold">SimSiam Loss</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">IntroVAE</span><span className="font-semibold">L_Rec + L_Reg</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Optimizer</span><span className="font-semibold">Adam (lr=1e-4)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Batch Size</span><span className="font-semibold">4</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Epochs</span><span className="font-semibold"><AnimatedCounter end={300} /></span></div>
            </div>
          </GlassCard>
        </div>

        {/* Comparison Chart */}
        <GlassCard {...fadeUp(0.4)}>
          <h3 className="font-heading font-semibold mb-4">Method Comparison — BraTS2022 Dice WT</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={compChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="method" tick={{ fontSize: 11, fill: "#999" }} />
              <YAxis domain={[0.85, 0.94]} tick={{ fontSize: 11, fill: "#999" }} />
              <Tooltip contentStyle={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Bar dataKey="wt" radius={[6, 6, 0, 0]}>
                {compChart.map((entry, i) => (
                  <Cell key={i} fill={entry.method === "Ours" ? "#4fc3f7" : "rgba(255,255,255,0.12)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
