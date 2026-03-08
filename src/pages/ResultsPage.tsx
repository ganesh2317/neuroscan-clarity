import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";
import { MRIViewer } from "@/components/results/MRIViewer";
import { MetricsPanel } from "@/components/results/MetricsPanel";
import { ComparisonTable } from "@/components/results/ComparisonTable";
import { AttentionMaps } from "@/components/results/AttentionMaps";

export default function ResultsPage() {
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
          <div className="lg:col-span-3">
            <MRIViewer />
          </div>
          <div className="lg:col-span-2">
            <MetricsPanel />
          </div>
        </div>

        <ComparisonTable />
        <AttentionMaps />

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
