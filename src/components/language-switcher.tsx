"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function LanguageSwitcher({ className }: { className?: string }) {
    const { language, setLanguage } = useI18n();

    return (
        <div className={cn("relative flex items-center bg-slate-100 dark:bg-slate-900/50 rounded-full p-1 border border-slate-200 dark:border-slate-800", className)}>
            <div className="relative z-0 flex">
                {/* Background Slider */}
                <motion.div
                    className="absolute top-1 bottom-1 bg-white dark:bg-slate-800 rounded-full shadow-sm z-0"
                    initial={false}
                    animate={{
                        x: language === "en" ? 0 : "100%",
                        width: "50%"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <button
                    onClick={() => setLanguage("en")}
                    className={cn(
                        "relative z-10 w-1/2 px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 text-center min-w-[3rem]",
                        language === "en" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    ENG
                </button>
                <button
                    onClick={() => setLanguage("bn")}
                    className={cn(
                        "relative z-10 w-1/2 px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 text-center min-w-[3rem]",
                        language === "bn" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    বাংলা
                </button>
            </div>
        </div>
    );
}

// Improved version with layoutId for smoother animation between buttons
export function LanguageSwitcherV2({ className }: { className?: string }) {
    const { language, setLanguage } = useI18n();

    return (
        <div className={cn("flex items-center bg-slate-100 dark:bg-slate-900/50 rounded-full p-1 border border-slate-200 dark:border-slate-800", className)}>
            <button
                onClick={() => setLanguage("en")}
                className={cn(
                    "relative px-4 py-1.5 text-xs font-medium rounded-full transition-colors duration-200",
                    language === "en" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                )}
            >
                {language === "en" && (
                    <motion.div
                        layoutId="active-lang-pill"
                        className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10">ENG</span>
            </button>

            <button
                onClick={() => setLanguage("bn")}
                className={cn(
                    "relative px-4 py-1.5 text-xs font-medium rounded-full transition-colors duration-200",
                    language === "bn" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                )}
            >
                {language === "bn" && (
                    <motion.div
                        layoutId="active-lang-pill"
                        className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10">বাংলা</span>
            </button>
        </div>
    );
}
