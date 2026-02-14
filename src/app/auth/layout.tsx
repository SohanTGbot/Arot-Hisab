"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcherV2 } from "@/components/language-switcher";
import FishAnimation from "@/components/FishAnimation/FishAnimation";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isSignIn = pathname?.includes("signin");

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans selection:bg-cyan-500/20 relative overflow-hidden">
            {/* Background Gradients */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-cyan-400/20 rounded-full blur-[80px] animate-pulse-slow delay-500" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

                {/* Floating Orbs */}
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"
                />
                <motion.div
                    animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl"
                />
            </div>

            {/* Fish Animation Background */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
                <FishAnimation frameCount={240} className="w-full h-full" />
            </div>

            {/* Language Switcher */}
            <div className="absolute top-6 right-6 z-20">
                <LanguageSwitcherV2 />
            </div>

            {/* Main Content */}
            <div className="w-full max-w-md p-6 relative z-10">
                {children}
            </div>
        </div>
    );
}
