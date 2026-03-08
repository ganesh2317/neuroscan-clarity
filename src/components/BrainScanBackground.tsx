export function BrainScanBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radial pulses simulating MRI scan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/10"
            style={{
              animation: `pulse-ring ${3 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
              animationDelay: `${i * 0.6}s`,
              transform: `scale(${0.3 + i * 0.18})`,
            }}
          />
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/30 animate-glow-pulse" />
      </div>
      {/* Scan line */}
      <div className="absolute left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
      {/* Ambient gradient orbs */}
      <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[20%] left-[10%] w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
    </div>
  );
}
