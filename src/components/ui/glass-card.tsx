"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1], // Cubic bezier for premium feel
                scale: { duration: 0.4 }
            }}
            className={cn(
                "relative overflow-hidden rounded-3xl",
                "bg-slate-900/40 backdrop-blur-xl",
                "border border-white/10 shadow-2xl",
                "p-8 md:p-10",
                className
            )}
        >
            {/* Ambient inner glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

            {/* Top highlight line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

            {/* Content Container */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
