"use client";

import { useEffect, useRef, TouchEvent } from "react";

interface SwipeHandlers {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
}

interface SwipeOptions {
    minSwipeDistance?: number;
    maxSwipeTime?: number;
}

export function useSwipeGesture(
    handlers: SwipeHandlers,
    options: SwipeOptions = {}
) {
    const { minSwipeDistance = 50, maxSwipeTime = 300 } = options;

    const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

    const onTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        touchStart.current = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now(),
        };
    };

    const onTouchEnd = (e: TouchEvent) => {
        if (!touchStart.current) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStart.current.x;
        const deltaY = touch.clientY - touchStart.current.y;
        const deltaTime = Date.now() - touchStart.current.time;

        // Check if swipe was fast enough
        if (deltaTime > maxSwipeTime) {
            touchStart.current = null;
            return;
        }

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Horizontal swipe
        if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
            if (deltaX > 0) {
                handlers.onSwipeRight?.();
            } else {
                handlers.onSwipeLeft?.();
            }
        }

        // Vertical swipe
        if (absDeltaY > absDeltaX && absDeltaY > minSwipeDistance) {
            if (deltaY > 0) {
                handlers.onSwipeDown?.();
            } else {
                handlers.onSwipeUp?.();
            }
        }

        touchStart.current = null;
    };

    return { onTouchStart, onTouchEnd };
}

// Pull to refresh hook
export function usePullToRefresh(onRefresh: () => Promise<void>) {
    const startY = useRef(0);
    const isRefreshing = useRef(false);

    useEffect(() => {
        const handleTouchStart = (e: globalThis.TouchEvent) => {
            if (window.scrollY === 0 && !isRefreshing.current) {
                startY.current = e.touches[0].clientY;
            }
        };

        const handleTouchMove = async (e: globalThis.TouchEvent) => {
            if (window.scrollY !== 0 || isRefreshing.current) return;

            const currentY = e.touches[0].clientY;
            const pullDistance = currentY - startY.current;

            if (pullDistance > 100) {
                isRefreshing.current = true;
                await onRefresh();
                isRefreshing.current = false;
            }
        };

        document.addEventListener("touchstart", handleTouchStart, { passive: true });
        document.addEventListener("touchmove", handleTouchMove, { passive: true });

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, [onRefresh]);
}

// Long press hook
export function useLongPress(
    onLongPress: () => void,
    options: { delay?: number } = {}
) {
    const { delay = 500 } = options;
    const timer = useRef<NodeJS.Timeout>();

    const start = () => {
        timer.current = setTimeout(onLongPress, delay);
    };

    const cancel = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    };

    return {
        onMouseDown: start,
        onMouseUp: cancel,
        onMouseLeave: cancel,
        onTouchStart: start,
        onTouchEnd: cancel,
    };
}
