"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ripple {
    x: number;
    y: number;
    id: number;
}

export function TouchRipple() {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent | TouchEvent) => {
            // Get coordinates
            let x, y;
            if (e instanceof MouseEvent) {
                x = e.clientX;
                y = e.clientY;
            } else {
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            }

            const newRipple = { x, y, id: Date.now() };
            setRipples((prev) => [...prev, newRipple]);
        };

        window.addEventListener("click", handleClick);
        // We can also add touchstart if we want it to be more responsive on mobile
        // window.addEventListener("touchstart", handleClick); 

        return () => {
            window.removeEventListener("click", handleClick);
            // window.removeEventListener("touchstart", handleClick);
        };
    }, []);

    const removeRipple = (id: number) => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    };

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.span
                        key={ripple.id}
                        initial={{ opacity: 0.8, scale: 0 }}
                        animate={{ opacity: 0, scale: 2.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        onAnimationComplete={() => removeRipple(ripple.id)}
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-400 blur-sm"
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
