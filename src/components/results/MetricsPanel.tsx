import { GlassCard } from "@/components/GlassCard";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

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

export function MetricsPanel() {
  return (
    <div className="space-y-4">
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
  );
}
