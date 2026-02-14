"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcherV2 } from "@/components/language-switcher";
import FishAnimation from "@/components/FishAnimation/FishAnimation";
import UnderwaterBackground from "@/components/Hero/UnderwaterBackground";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isSignIn = pathname?.includes("signin");

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans selection:bg-cyan-500/20 relative overflow-hidden">
            {/* Underwater Background */}
            <div className="absolute inset-0 z-0">
                <UnderwaterBackground />
                {/* Overlay Gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950/80 pointer-events-none" />
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
