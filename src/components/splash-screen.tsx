"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface SplashScreenProps {
    onComplete: () => void;
    duration?: number;
}

export function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onComplete, 300); // Wait for fade out
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5"
        >
            <div className="flex flex-col items-center gap-6">
                {/* Logo Container */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="relative"
                >
                    {/* Pulsing Background */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
                    />

                    {/* Logo Icon */}
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-2xl shadow-primary/50">
                        <Sparkles className="h-12 w-12 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                </motion.div>

                {/* App Name */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-col items-center gap-2"
                >
                    <h1 className="text-3xl font-bold text-foreground">Arot Hisab</h1>
                    <p className="text-sm text-muted-foreground">Fish Market Calculator</p>
                </motion.div>

                {/* Loading Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-1.5"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="h-2 w-2 rounded-full bg-primary"
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}
