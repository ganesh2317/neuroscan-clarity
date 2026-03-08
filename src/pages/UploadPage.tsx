import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileImage, CheckCircle, User, Calendar, Building2, Loader2, Brain } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";
import { useNavigate } from "react-router-dom";

const modalities = [
  { key: "t1", label: "T1", desc: "Structural anatomy, gray/white matter contrast", color: "primary" },
  { key: "t1c", label: "T1c", desc: "Enhancing tumor core with contrast agents", color: "primary" },
  { key: "t2", label: "T2", desc: "Edema and tumor boundary detection", color: "primary" },
  { key: "flair", label: "FLAIR", desc: "Fluid-attenuated — whole tumor visualization", color: "primary" },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<Record<string, File | null>>({ t1: null, t1c: null, t2: null, flair: null });
  const [patientInfo, setPatientInfo] = useState({ id: "", age: "", gender: "", date: "", hospital: "" });
  const [uploading, setUploading] = useState(false);

  const handleDrop = (key: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleFileSelect = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const loadDemo = () => {
    const demoFile = new File(["demo"], "demo_scan.nii.gz", { type: "application/gzip" });
    setFiles({ t1: demoFile, t1c: demoFile, t2: demoFile, flair: demoFile });
    setPatientInfo({ id: "PT-2024-0847", age: "54", gender: "Male", date: "2024-03-15", hospital: "Johns Hopkins" });
  };

  const uploadedCount = Object.values(files).filter(Boolean).length;
  const canAnalyze = uploadedCount === 4;

  const handleAnalyze = () => {
    setUploading(true);
    setTimeout(() => navigate("/processing"), 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold mb-2">Upload MRI Scans</h1>
          <p className="text-muted-foreground mb-8">Upload all four modalities for accurate segmentation analysis</p>
        </motion.div>

        {/* Upload Zones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {modalities.map((mod, i) => (
            <motion.div
              key={mod.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard
                className={`relative group cursor-pointer ${files[mod.key] ? "border-accent/40" : ""}`}
                onDrop={handleDrop(mod.key)}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="absolute top-3 right-3">
                  {files[mod.key] ? (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-semibold">{mod.label}</span>
                  )}
                </div>
                <label className="flex flex-col items-center text-center cursor-pointer py-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                    files[mod.key] ? "bg-accent/10" : "bg-primary/10 group-hover:bg-primary/20"
                  }`}>
                    {files[mod.key] ? (
                      <FileImage className="w-7 h-7 text-accent" />
                    ) : (
                      <Upload className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  {files[mod.key] ? (
                    <span className="text-sm text-accent font-medium">{files[mod.key]!.name}</span>
                  ) : (
                    <>
                      <span className="text-sm font-medium mb-1">Drop NIfTI/PNG/JPG</span>
                      <span className="text-xs text-muted-foreground">or click to browse</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept=".nii,.nii.gz,.png,.jpg,.jpeg" onChange={handleFileSelect(mod.key)} />
                </label>
                <div className="mt-2 pt-3 border-t border-white/5">
                  <p className="text-xs text-muted-foreground">{mod.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        {uploadedCount > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <GlassCard className="!p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Upload Progress</span>
                <span className="text-sm text-primary">{uploadedCount}/4 modalities</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(uploadedCount / 4) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Patient Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="mb-8">
            <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { key: "id", label: "Patient ID", placeholder: "PT-2024-XXXX", icon: User },
                { key: "age", label: "Age", placeholder: "54", icon: User },
                { key: "gender", label: "Gender", placeholder: "Male/Female", icon: User },
                { key: "date", label: "Scan Date", placeholder: "2024-03-15", icon: Calendar },
                { key: "hospital", label: "Hospital", placeholder: "Institution", icon: Building2 },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    value={patientInfo[field.key as keyof typeof patientInfo]}
                    onChange={(e) => setPatientInfo((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full glass rounded-lg px-3 py-2 text-sm bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || uploading}
            className={`btn-glass-primary text-base inline-flex items-center gap-2 ${
              canAnalyze ? "glow-primary" : "opacity-50 cursor-not-allowed"
            }`}
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
            {uploading ? "Analyzing..." : "Analyze Scan"}
          </button>
          <button onClick={loadDemo} className="btn-glass-outline text-base inline-flex items-center gap-2">
            <FileImage className="w-4 h-4" /> Load Demo MRI
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
