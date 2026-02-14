"use client";

import React, { useEffect, useRef, useState } from "react";

interface MobileFitContainerProps {
    children: React.ReactNode;
    headerHeight?: number; // Approximate header height (e.g., 64px)
    bottomNavHeight?: number; // Approximate bottom nav height (e.g., 60px)
}

export function MobileFitContainer({
    children,
    headerHeight = 64, // Default header height
    bottomNavHeight = 0, // Default bottom nav height (adjust if you have one)
}: MobileFitContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;

            // 1. Measure available viewport height
            // We use visualViewport.height if available to account for onscreen keyboard
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const availableHeight = viewportHeight - headerHeight - bottomNavHeight;

            // 2. Measure natural layout height (design height)
            // We reset scale to 1 temporarily to get the true natural height
            // But doing that causes flickering. Instead, we can measure scrollHeight of the inner wrapper?
            // Or we can assume the container's scrollHeight *at scale 1* is what we want.
            // A better approach is to wrap children in a div that is NOT scaled, measure it, and then apply scale to a wrapper.
            // But here we might just measure the scrollHeight of the content.

            const contentElement = containerRef.current.firstElementChild as HTMLElement;
            if (!contentElement) return;

            const designHeight = contentElement.scrollHeight; // Or offsetHeight

            // 3. Compute scale factor
            // Prevent scaling up (max 1), only scale down to fit.
            const newScale = Math.min(1, availableHeight / designHeight);

            setScale(newScale);
        };

        // Initial calculation
        handleResize();

        // Listen for resize and visualViewport resize (keyboard)
        window.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("resize", handleResize);

        // Disable body and main scroll
        document.body.style.overflow = "hidden";
        const mainElement = document.querySelector("main");
        if (mainElement) {
            mainElement.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("resize", handleResize);
            document.body.style.overflow = ""; // Restore scroll
            if (mainElement) {
                mainElement.style.overflow = "";
            }
        };
    }, [headerHeight, bottomNavHeight]);

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center horizontally
                overflow: "hidden", // Prevent scrolling
            }}
        >
            <div
                ref={containerRef}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                    width: "100%", // Maintain width
                    // Ensure the content can take up its natural height
                }}
                className="w-full"
            >
                {children}
            </div>
        </div>
    );
}
