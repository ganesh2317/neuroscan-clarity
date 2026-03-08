import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Eye, EyeOff, ZoomIn, ZoomOut } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const diceData = [
  { name: "ET", value: 0.869, color: "#4fc3f7" },
  { name: "TC", value: 0.897, color: "#69f0ae" },
  { name: "WT", value: 0.929, color: "#ffd740" },
];

const perfData = [
  { metric: "Sensitivity", value: 0.91 },
  { metric: "Precision", value: 0.93 },
  { metric: "Specificity", value: 0.98 },
  { metric: "Jaccard", value: 0.87 },
];

const hdData = [
  { region: "ET", value: 3.323 },
  { region: "TC", value: 5.118 },
  { region: "WT", value: 5.844 },
];

const comparisonData = [
  { method: "V-Net", et: 0.812, tc: 0.847, wt: 0.891, hd: 7.23, sens: 0.85, ours: false },
  { method: "Attention U-Net", et: 0.831, tc: 0.862, wt: 0.903, hd: 6.44, sens: 0.87, ours: false },
  { method: "nnU-Net", et: 0.849, tc: 0.879, wt: 0.918, hd: 5.67, sens: 0.89, ours: false },
  { method: "UNETR", et: 0.843, tc: 0.871, wt: 0.912, hd: 5.98, sens: 0.88, ours: false },
  { method: "nnFormer", et: 0.856, tc: 0.885, wt: 0.921, hd: 5.34, sens: 0.90, ours: false },
  { method: "TransBTS", et: 0.851, tc: 0.878, wt: 0.916, hd: 5.51, sens: 0.89, ours: false },
  { method: "Ours (FAM+GCB)", et: 0.869, tc: 0.897, wt: 0.929, hd: 3.32, sens: 0.91, ours: true },
];

const tabs = ["T1", "T1c", "T2", "FLAIR", "Normal (IntroVAE)", "Segmentation"];

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("Segmentation");
  const [showOverlay, setShowOverlay] = useState(true);
  const [slice, setSlice] = useState(64);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Summary Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="mb-6 !p-4 flex flex-wrap items-center gap-6">
            {[
              { label: "Patient ID", value: "PT-2024-0847" },
              { label: "Scan Date", value: "2024-03-15" },
              { label: "Processing Time", value: "24.3s" },
              { label: "Confidence", value: "97.6%" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="font-semibold text-sm">{item.value}</div>
              </div>
            ))}
          </GlassCard>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: MRI Viewer */}
          <div className="lg:col-span-3">
            <GlassCard className="mb-4">
              <div className="flex flex-wrap gap-1 mb-4">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Image Viewer */}
              <div className="relative aspect-square rounded-xl bg-gradient-to-br from-background to-muted/20 border border-white/5 overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 rounded-full bg-gradient-radial from-muted/30 to-transparent relative">
                    {showOverlay && activeTab === "Segmentation" && (
                      <>
                        <div className="absolute top-[25%] left-[35%] w-[30%] h-[25%] rounded-full bg-muted-foreground/20 border border-muted-foreground/30" title="Edema" />
                        <div className="absolute top-[32%] left-[42%] w-[16%] h-[14%] rounded-full bg-foreground/30 border border-foreground/40" title="Enhancing Core" />
                        <div className="absolute top-[36%] left-[46%] w-[8%] h-[7%] rounded-full bg-muted-foreground/40" title="Necrosis" />
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 text-xs text-muted-foreground glass-card-sm !p-2">
                  Slice {slice}/128
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button onClick={() => setShowOverlay(!showOverlay)} className="btn-glass-outline !py-2 !px-3 text-xs inline-flex items-center gap-1">
                  {showOverlay ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showOverlay ? "Hide Overlay" : "Show Overlay"}
                </button>
                <div className="flex items-center gap-2 flex-1">
                  <ZoomOut className="w-4 h-4 text-muted-foreground" />
                  <input type="range" min={1} max={128} value={slice} onChange={(e) => setSlice(Number(e.target.value))}
                    className="flex-1 accent-primary" />
                  <ZoomIn className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
                {[
                  { label: "Edema (WT)", color: "bg-muted-foreground/40" },
                  { label: "Enhancing Core", color: "bg-foreground/50" },
                  { label: "Necrosis", color: "bg-muted-foreground/70" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                    {item.label}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right: Metrics */}
          <div className="lg:col-span-2 space-y-4">
            {/* Dice Scores */}
            <GlassCard>
              <h3 className="font-heading font-semibold mb-4 text-sm">Dice Scores</h3>
              <div className="flex justify-center mb-4">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={diceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {diceData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {diceData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold">{d.value.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Performance */}
            <GlassCard>
              <h3 className="font-heading font-semibold mb-4 text-sm">Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={perfData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 10, fill: "#666" }} />
                  <YAxis dataKey="metric" type="category" tick={{ fontSize: 10, fill: "#999" }} width={70} />
                  <Bar dataKey="value" fill="#4fc3f7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Hausdorff */}
            <GlassCard>
              <h3 className="font-heading font-semibold mb-3 text-sm">Hausdorff Distance (mm)</h3>
              <p className="text-xs text-muted-foreground mb-3">Lower = better boundary accuracy</p>
              <div className="space-y-2">
                {hdData.map((d) => (
                  <div key={d.region} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{d.region}</span>
                    <span className="font-semibold">{d.value} mm</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Tumor Analysis */}
            <GlassCard>
              <h3 className="font-heading font-semibold mb-3 text-sm">Tumor Analysis</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Total Volume</span><span className="font-semibold">42.7 cm³</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-semibold">Right Temporal</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Largest Dim</span><span className="font-semibold">4.8 cm</span></div>
                <div className="pt-2 border-t border-white/5 space-y-1">
                  {[{ label: "Edema", pct: 58 }, { label: "Core", pct: 28 }, { label: "Necrosis", pct: 14 }].map((r) => (
                    <div key={r.label} className="flex items-center gap-2">
                      <span className="text-muted-foreground w-16 text-xs">{r.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-primary/60" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-xs w-8 text-right">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8">
          <GlassCard>
            <h3 className="font-heading font-semibold mb-4">Method Comparison on BraTS2022</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Method", "Dice ET", "Dice TC", "Dice WT", "HD95 (mm)", "Sensitivity"].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr key={row.method} className={`border-b border-white/5 ${row.ours ? "bg-warning/5" : ""}`}>
                      <td className={`py-2.5 px-3 font-medium ${row.ours ? "text-warning" : ""}`}>{row.method}</td>
                      <td className="py-2.5 px-3">{row.et.toFixed(3)}</td>
                      <td className="py-2.5 px-3">{row.tc.toFixed(3)}</td>
                      <td className="py-2.5 px-3">{row.wt.toFixed(3)}</td>
                      <td className="py-2.5 px-3">{row.hd.toFixed(2)}</td>
                      <td className="py-2.5 px-3">{row.sens.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Attention Maps */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6">
          <GlassCard>
            <h3 className="font-heading font-semibold mb-4">Attention Maps (FAM)</h3>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((level) => (
                <div key={level} className="text-center">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-white/10 flex items-center justify-center mb-2">
                    <div className="w-3/4 h-3/4 rounded-full" style={{
                      background: `radial-gradient(circle at ${30 + level * 10}% ${40 + level * 5}%, rgba(79,195,247,${0.2 + level * 0.1}), transparent 60%)`
                    }} />
                  </div>
                  <span className="text-xs text-muted-foreground">Level {level} ({level === 1 ? "coarse" : level === 4 ? "fine" : "mid"})</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Export */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="btn-glass-primary text-sm inline-flex items-center gap-2"><Download className="w-4 h-4" /> Download Report PDF</button>
          <button className="btn-glass-outline text-sm inline-flex items-center gap-2"><Download className="w-4 h-4" /> Download Segmentation Mask</button>
          <button className="btn-glass-outline text-sm inline-flex items-center gap-2"><Share2 className="w-4 h-4" /> Share Results</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
