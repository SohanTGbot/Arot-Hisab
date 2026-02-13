"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface PullToRefreshProps {
    children: ReactNode;
    onRefresh: () => Promise<void>;
    threshold?: number;
}

export function PullToRefresh({
    children,
    onRefresh,
    threshold = 80,
}: PullToRefreshProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const pullDistance = useMotionValue(0);
    const pullProgress = useTransform(pullDistance, [0, threshold], [0, 1]);

    let startY = 0;

    const handleTouchStart = (e: React.TouchEvent) => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop === 0) {
            startY = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0 && window.pageYOffset === 0) {
            setIsPulling(true);
            pullDistance.set(Math.min(distance, threshold * 1.5));
        }
    };

    const handleTouchEnd = async () => {
        if (isRefreshing) return;

        if (pullDistance.get() >= threshold) {
            setIsRefreshing(true);
            pullDistance.set(threshold);

            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                pullDistance.set(0);
                setIsPulling(false);
            }
        } else {
            pullDistance.set(0);
            setIsPulling(false);
        }
    };

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative"
        >
            {/* Pull indicator */}
            <motion.div
                style={{
                    height: pullDistance,
                    opacity: pullProgress,
                }}
                className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gradient-to-b from-primary/10 to-transparent"
            >
                <motion.div
                    animate={{
                        rotate: isRefreshing ? 360 : 0,
                    }}
                    transition={{
                        duration: 1,
                        repeat: isRefreshing ? Infinity : 0,
                        ease: "linear",
                    }}
                    className="text-primary"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div style={{ y: pullDistance }}>{children}</motion.div>
        </div>
    );
}
