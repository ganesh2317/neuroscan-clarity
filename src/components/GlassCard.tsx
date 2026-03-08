import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: "primary" | "success" | "warning" | "danger";
  hover?: boolean;
}

export function GlassCard({ className, glow, hover = true, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-card",
        hover && "glass-hover transition-all duration-300",
        glow === "primary" && "glow-primary",
        glow === "success" && "glow-success",
        glow === "warning" && "glow-warning",
        glow === "danger" && "glow-danger",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
