import { motion } from "framer-motion";
import { ExternalLink, Github, BookOpen } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";

const innovations = [
  {
    title: "Why Normal Brain Images Help",
    desc: "By generating a healthy brain reference from the patient's own scan, the model can detect tumor regions by comparing against what the brain 'should' look like — dramatically improving boundary detection.",
  },
  {
    title: "Multimodal vs Monomodal Problem",
    desc: "Tumor images are multimodal (T1, T1c, T2, FLAIR) but normal references are only available in T1. The Feature Alignment Module bridges this gap by projecting both into a shared feature space.",
  },
  {
    title: "GCB Improves Over Traditional Fusion",
    desc: "Global Correlation Block uses self-attention to dynamically weight modalities per encoding level, unlike concatenation or averaging which treat all modalities equally.",
  },
  {
    title: "SimSiam Prevents Feature Collapse",
    desc: "Without SimSiam, the alignment module could collapse all features to trivial solutions. SimSiam loss ensures normal-region features stay meaningful and informative.",
  },
];

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold mb-8">About This Research</h1>
        </motion.div>

        {/* Citation */}
        <GlassCard className="mb-8 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg mb-2">
                "Multimodal Brain Tumor Segmentation Boosted by Monomodal Normal Brain Images"
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                IEEE Transactions on Image Processing, Vol. 33, 2024
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                <strong className="text-foreground">Authors:</strong> Huabing Liu, Zhengze Ni, Dong Nie, Dinggang Shen, Jinda Wang, Zhenyu Tang
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                <strong className="text-foreground">DOI:</strong> 10.1109/TIP.2024.3359815
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://doi.org/10.1109/TIP.2024.3359815" target="_blank" rel="noopener noreferrer"
                  className="btn-glass-primary text-xs inline-flex items-center gap-1 !py-2">
                  <ExternalLink className="w-3 h-3" /> View Paper
                </a>
                <a href="https://github.com/hb-liu/Normal-Brain-Boost-Tumor-Segmentation" target="_blank" rel="noopener noreferrer"
                  className="btn-glass-outline text-xs inline-flex items-center gap-1 !py-2">
                  <Github className="w-3 h-3" /> Source Code
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Key Innovations */}
        <h2 className="font-heading text-2xl font-bold mb-6">Key Innovations</h2>
        <div className="space-y-4">
          {innovations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
