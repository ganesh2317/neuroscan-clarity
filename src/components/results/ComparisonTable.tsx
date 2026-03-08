import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";

const comparisonData = [
  { method: "V-Net", et: 0.812, tc: 0.847, wt: 0.891, hd: 7.23, sens: 0.85, ours: false },
  { method: "Attention U-Net", et: 0.831, tc: 0.862, wt: 0.903, hd: 6.44, sens: 0.87, ours: false },
  { method: "nnU-Net", et: 0.849, tc: 0.879, wt: 0.918, hd: 5.67, sens: 0.89, ours: false },
  { method: "UNETR", et: 0.843, tc: 0.871, wt: 0.912, hd: 5.98, sens: 0.88, ours: false },
  { method: "nnFormer", et: 0.856, tc: 0.885, wt: 0.921, hd: 5.34, sens: 0.90, ours: false },
  { method: "TransBTS", et: 0.851, tc: 0.878, wt: 0.916, hd: 5.51, sens: 0.89, ours: false },
  { method: "Ours (FAM+GCB)", et: 0.869, tc: 0.897, wt: 0.929, hd: 3.32, sens: 0.91, ours: true },
];

export function ComparisonTable() {
  return (
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
  );
}
