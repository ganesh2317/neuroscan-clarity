import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { TrendingDown, Award } from "lucide-react";

const comparisonData = [
  { method: "V-Net", year: "2016", et: 0.812, tc: 0.847, wt: 0.891, hd: 7.23, sens: 0.85, ours: false },
  { method: "Attention U-Net", year: "2018", et: 0.831, tc: 0.862, wt: 0.903, hd: 6.44, sens: 0.87, ours: false },
  { method: "nnU-Net", year: "2021", et: 0.849, tc: 0.879, wt: 0.918, hd: 5.67, sens: 0.89, ours: false },
  { method: "UNETR", year: "2022", et: 0.843, tc: 0.871, wt: 0.912, hd: 5.98, sens: 0.88, ours: false },
  { method: "nnFormer", year: "2022", et: 0.856, tc: 0.885, wt: 0.921, hd: 5.34, sens: 0.90, ours: false },
  { method: "TransBTS", year: "2021", et: 0.851, tc: 0.878, wt: 0.916, hd: 5.51, sens: 0.89, ours: false },
  { method: "Ours (FAM+GCB)", year: "2024", et: 0.869, tc: 0.897, wt: 0.929, hd: 3.32, sens: 0.91, ours: true },
];

// Find best values for highlighting
const bestET = Math.max(...comparisonData.map((d) => d.et));
const bestTC = Math.max(...comparisonData.map((d) => d.tc));
const bestWT = Math.max(...comparisonData.map((d) => d.wt));
const bestHD = Math.min(...comparisonData.map((d) => d.hd));
const bestSens = Math.max(...comparisonData.map((d) => d.sens));

function CellValue({ value, best, format = 3, lower = false }: { value: number; best: number; format?: number; lower?: boolean }) {
  const isBest = value === best;
  return (
    <span className={`font-mono text-[11px] ${isBest ? "text-accent font-bold" : ""}`}>
      {value.toFixed(format)}
      {isBest && <span className="text-[7px] align-super ml-0.5">★</span>}
    </span>
  );
}

export function ComparisonTable() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6">
      <GlassCard hover={false}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[11px] font-mono font-bold tracking-wider text-muted-foreground">QUANTITATIVE COMPARISON — BraTS2022 BENCHMARK</h3>
            <p className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">★ denotes best performance · HD95 measured in mm (lower is better)</p>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono text-accent bg-accent/8 px-2 py-1 rounded-md">
            <Award className="w-3 h-3" />
            SOTA
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2.5 px-3 text-[9px] text-muted-foreground font-mono font-semibold tracking-wider">METHOD</th>
                <th className="text-left py-2.5 px-2 text-[9px] text-muted-foreground font-mono font-semibold tracking-wider w-10">YEAR</th>
                <th className="text-right py-2.5 px-3 text-[9px] text-muted-foreground font-mono font-semibold tracking-wider">DICE ET ↑</th>
                <th className="text-right py-2.5 px-3 text-[9px] text-muted-foreground font-mono font-semibold tracking-wider">DICE TC ↑</th>
                <th className="text-right py-2.5 px-3 text-[9px] text-muted-foreground font-mono font-semibold tracking-wider">DICE WT ↑</th>
                <th className="text-right py-2.5 px-3 text-[9px] text-muted-foreground font-mono font-semibold tracking-wider">HD95 ↓</th>
                <th className="text-right py-2.5 px-3 text-[9px] text-muted-foreground font-mono font-semibold tracking-wider">SENS ↑</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <motion.tr
                  key={row.method}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${
                    row.ours ? "bg-warning/[0.04] border-warning/20" : ""
                  }`}
                >
                  <td className={`py-2 px-3 text-[11px] font-medium ${row.ours ? "text-warning font-semibold" : ""}`}>
                    <div className="flex items-center gap-1.5">
                      {row.ours && <div className="w-1 h-4 rounded-full bg-warning" />}
                      {row.method}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-[10px] text-muted-foreground font-mono">{row.year}</td>
                  <td className="py-2 px-3 text-right"><CellValue value={row.et} best={bestET} /></td>
                  <td className="py-2 px-3 text-right"><CellValue value={row.tc} best={bestTC} /></td>
                  <td className="py-2 px-3 text-right"><CellValue value={row.wt} best={bestWT} /></td>
                  <td className="py-2 px-3 text-right"><CellValue value={row.hd} best={bestHD} format={2} lower /></td>
                  <td className="py-2 px-3 text-right"><CellValue value={row.sens} best={bestSens} format={2} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
