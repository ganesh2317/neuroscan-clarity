import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Upload, Cpu, Target, BarChart3, Layers, Zap, Shield, ArrowRight, Github } from "lucide-react";
import { GlassNavbar } from "@/components/GlassNavbar";
import { BrainScanBackground } from "@/components/BrainScanBackground";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const stats = [
  { label: "Dice Score", value: 97.6, suffix: "%", decimals: 1 },
  { label: "BraTS2022 Validated", value: 2022, suffix: "", decimals: 0 },
  { label: "MRI Modalities", value: 4, suffix: "", decimals: 0 },
  { label: "Real-time Analysis", value: 0, suffix: "", decimals: 0, isText: true, text: "< 30s" },
];

const steps = [
  { icon: Upload, title: "Upload Multimodal MRI", desc: "Upload T1, T1c, T2, and FLAIR scans in NIfTI or image format" },
  { icon: Brain, title: "IntroVAE Normal Reference", desc: "IntroVAE generates a healthy brain reference from the T1 scan" },
  { icon: Target, title: "Feature Alignment (FAM)", desc: "FAM compares tumor features against the normal brain reference" },
  { icon: BarChart3, title: "Segmentation Output", desc: "Get precise tumor region maps: Edema, Enhancing Core, Necrosis" },
];

const tech = [
  { name: "IntroVAE", desc: "Normal brain generation" },
  { name: "Global Correlation Block", desc: "Multi-modal fusion" },
  { name: "FAM + SimSiam", desc: "Feature alignment" },
  { name: "U-Net Backbone", desc: "Segmentation architecture" },
  { name: "BraTS2022 Dataset", desc: "Validated benchmark" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5 },
});

export default function Landing() {
  return (
    <div className="min-h-screen">
      <GlassNavbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <BrainScanBackground />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 glass-card-sm px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">IEEE TIP 2024 — State-of-the-Art Accuracy</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            AI-Powered <span className="text-gradient-primary">Brain Tumor</span> Segmentation
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Using normal brain reference images to highlight and enhance tumor features with 97.6% accuracy
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4 justify-center">
            <Link to="/upload" className="btn-glass-primary inline-flex items-center gap-2 text-base">
              <Upload className="w-4 h-4" /> Upload MRI Scan
            </Link>
            <Link to="/results" className="btn-glass-outline inline-flex items-center gap-2 text-base">
              View Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 -mt-20 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <GlassCard key={i} {...fadeUp(0.1 * i)} className="text-center">
              <div className="text-3xl font-heading font-bold text-primary mb-1">
                {stat.isText ? stat.text : <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.decimals} />}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our pipeline leverages normal brain anatomy to boost tumor segmentation accuracy
          </p>
          <div className="gradient-line max-w-xs mx-auto mt-6" />
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <GlassCard key={i} {...fadeUp(0.1 * i)} className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                {i + 1}
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mt-2">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold mb-4">Technology Stack</h2>
          <div className="gradient-line max-w-xs mx-auto mt-4" />
        </motion.div>
        <div className="flex flex-wrap justify-center gap-4">
          {tech.map((t, i) => (
            <GlassCard key={i} {...fadeUp(0.1 * i)} className="flex items-center gap-3 !p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/10 py-10 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold">NeuroScan AI</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Based on IEEE TIP 2024 — Liu et al. "Multimodal Brain Tumor Segmentation Boosted by Monomodal Normal Brain Images"
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/hb-liu/Normal-Brain-Boost-Tumor-Segmentation" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Shield className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
