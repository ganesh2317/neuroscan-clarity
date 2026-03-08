import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

const diceData = [
  { name: "ET (Enhancing)", value: 0.869, color: "#4fc3f7" },
  { name: "TC (Tumor Core)", value: 0.897, color: "#69f0ae" },
  { name: "WT (Whole Tumor)", value: 0.929, color: "#ffd740" },
];

const perfData = [
  { metric: "Sensitivity", value: 0.91, fullMark: 1 },
  { metric: "Precision", value: 0.93, fullMark: 1 },
  { metric: "Specificity", value: 0.98, fullMark: 1 },
  { metric: "Jaccard", value: 0.87, fullMark: 1 },
  { metric: "F1-Score", value: 0.92, fullMark: 1 },
];

const hdData = [
  { region: "ET", value: 3.323, benchmark: 5.67, unit: "mm" },
  { region: "TC", value: 5.118, benchmark: 6.44, unit: "mm" },
  { region: "WT", value: 5.844, benchmark: 7.23, unit: "mm" },
];

const volumeBreakdown = [
  { label: "Peritumoral Edema", volume: 24.83, pct: 58, color: "#ffd740" },
  { label: "Enhancing Core", volume: 11.94, pct: 28, color: "#4fc3f7" },
  { label: "Necrotic Core", volume: 5.97, pct: 14, color: "#ff5252" },
];

export function MetricsPanel() {
  const [hoveredDice, setHoveredDice] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {/* Dice Scores — clinical precision */}
      <GlassCard hover={false}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-mono font-bold tracking-wider text-muted-foreground">DICE SIMILARITY COEFFICIENT</h3>
          <span className="text-[9px] font-mono text-primary/70 bg-primary/8 px-1.5 py-0.5 rounded">BraTS2022</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={diceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {diceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={hoveredDice && hoveredDice !== entry.name ? 0.3 : 1} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold leading-none">0.898</div>
                <div className="text-[8px] text-muted-foreground font-mono">AVG</div>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {diceData.map((d) => (
              <div
                key={d.name}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredDice(d.name)}
                onMouseLeave={() => setHoveredDice(null)}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[10px] text-muted-foreground font-mono">{d.name.split(" (")[0]}</span>
                  </div>
                  <span className="text-[11px] font-bold font-mono">{d.value.toFixed(3)}</span>
                </div>
                <div className="h-[3px] rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.value * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Performance Radar */}
      <GlassCard hover={false}>
        <h3 className="text-[11px] font-mono font-bold tracking-wider text-muted-foreground mb-3">PERFORMANCE METRICS</h3>
        <ResponsiveContainer width="100%" height={180}>
          <RadarChart data={perfData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "#888" }} />
            <Radar dataKey="value" stroke="#4fc3f7" fill="#4fc3f7" fillOpacity={0.15} strokeWidth={1.5} dot={{ r: 3, fill: "#4fc3f7" }} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {perfData.slice(0, 3).map((d) => (
            <div key={d.metric} className="text-center bg-secondary/20 rounded-md p-1.5">
              <div className="text-[10px] font-bold font-mono">{d.value.toFixed(2)}</div>
              <div className="text-[8px] text-muted-foreground font-mono">{d.metric.slice(0, 4).toUpperCase()}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Hausdorff Distance — with benchmark comparison */}
      <GlassCard hover={false}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-mono font-bold tracking-wider text-muted-foreground">HAUSDORFF DISTANCE 95</h3>
          <span className="text-[9px] font-mono text-accent/70 bg-accent/8 px-1.5 py-0.5 rounded">↓ Better</span>
        </div>
        <div className="space-y-2.5">
          {hdData.map((d) => {
            const improvement = Math.round((1 - d.value / d.benchmark) * 100);
            return (
              <div key={d.region}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground font-mono">{d.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-muted-foreground/50 font-mono line-through">{d.benchmark}mm</span>
                    <span className="text-[11px] font-bold font-mono">{d.value}mm</span>
                    <span className="text-[8px] font-mono text-accent bg-accent/10 px-1 rounded">-{improvement}%</span>
                  </div>
                </div>
                <div className="h-[3px] rounded-full bg-white/5 overflow-hidden relative">
                  <div className="absolute h-full bg-muted-foreground/15 rounded-full" style={{ width: `${(d.benchmark / 8) * 100}%` }} />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.value / 8) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full bg-accent relative z-10"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Tumor Volumetric Analysis */}
      <GlassCard hover={false}>
        <h3 className="text-[11px] font-mono font-bold tracking-wider text-muted-foreground mb-3">TUMOR VOLUMETRIC ANALYSIS</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-secondary/20 rounded-lg p-2 text-center">
            <div className="text-base font-bold leading-none">42.74</div>
            <div className="text-[8px] text-muted-foreground font-mono mt-1">TOTAL cm³</div>
          </div>
          <div className="bg-secondary/20 rounded-lg p-2 text-center">
            <div className="text-base font-bold leading-none">4.8</div>
            <div className="text-[8px] text-muted-foreground font-mono mt-1">MAX DIM cm</div>
          </div>
          <div className="bg-secondary/20 rounded-lg p-2 text-center">
            <div className="text-base font-bold leading-none text-warning">IV</div>
            <div className="text-[8px] text-muted-foreground font-mono mt-1">WHO GRADE</div>
          </div>
        </div>

        <div className="text-[10px] mb-2">
          <div className="flex justify-between text-muted-foreground">
            <span className="font-mono">Location</span>
            <span className="font-medium text-foreground">Right Temporal-Parietal</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-white/5 pt-2">
          {volumeBreakdown.map((r) => (
            <div key={r.label}>
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-[9px] text-muted-foreground font-mono">{r.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground font-mono">{r.volume} cm³</span>
                  <span className="text-[10px] font-bold font-mono w-8 text-right">{r.pct}%</span>
                </div>
              </div>
              <div className="h-[3px] rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.pct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: r.color, opacity: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
