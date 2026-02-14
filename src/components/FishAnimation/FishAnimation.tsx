"use client";

import React, { useRef, useEffect, useState } from "react";
import { FrameLoader } from "@/lib/animation/FrameLoader";
import { AnimationController } from "@/lib/animation/AnimationController";
import { useInView } from "react-intersection-observer";

interface FishAnimationProps {
    frameCount?: number;
    className?: string;
}

export default function FishAnimation({
    frameCount = 240,
    className = "",
}: FishAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<AnimationController | null>(null);
    const loaderRef = useRef<FrameLoader | null>(null);

    const [hasStarted, setHasStarted] = useState(false);
    const { ref: inViewRef, inView } = useInView({
        threshold: 0,
        rootMargin: "200px 0px", // Start slightly before entering viewport
    });

    // Combine refs
    const setRefs = (node: HTMLDivElement) => {
        // ref(node); // react-intersection-observer's ref
        inViewRef(node);
        (containerRef as any).current = node;
    };

    useEffect(() => {
        // Initialize Loader once
        if (!loaderRef.current) {
            // Use the path where we moved the frames: public/fish-animation
            // The loader adds the base path. Note that in Next.js public files are served at root.
            // So path is just '/fish-animation'
            loaderRef.current = new FrameLoader(frameCount, "/fish-animation", ".jpg");
            loaderRef.current.preload(30); // Preload first second immediately
        }
    }, [frameCount]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !loaderRef.current) return;

        const ctx = canvas.getContext("2d", { alpha: false }); // Optimization: alpha false if background is opaque
        if (!ctx) return;

        // Initialize Controller
        const controller = new AnimationController({
            canvasContext: ctx,
            frameLoader: loaderRef.current,
            totalFrames: frameCount,
            width: container.clientWidth,
            height: container.clientHeight,
            fps: 60, // Targeting smooth animation
        });

        controllerRef.current = controller;
        setHasStarted(true);

        // Initial resize
        const handleResize = () => {
            if (container && canvas && controllerRef.current) {
                const dpr = window.devicePixelRatio || 1;
                const rect = container.getBoundingClientRect();

                // Set actual canvas size (resolution)
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                // Scale context to match DPI
                ctx.scale(dpr, dpr);

                // Update controller logical size
                controllerRef.current.setDimensions(rect.width, rect.height);
            }
        };

        // Interaction handlers
        const handleMouseMove = (e: MouseEvent) => {
            if (!controllerRef.current) return;
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalize -1 to 1
            const normX = (e.clientX - centerX) / (rect.width / 2);
            const normY = (e.clientY - centerY) / (rect.height / 2);

            controllerRef.current.updateInteraction(-normX, -normY); // Invert for parallax
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        // Trigger initial sizing
        handleResize();

        return () => {
            controller.stop();
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [frameCount]);

    // Handle Play/Pause based on visibility
    useEffect(() => {
        if (!controllerRef.current) return;

        if (inView && hasStarted) {
            controllerRef.current.start();
            // Trigger lazy loading of remaining frames when in view
            loaderRef.current?.preload(240);
        } else {
            controllerRef.current.stop();
        }
    }, [inView, hasStarted]);

    return (
        <div
            ref={setRefs}
            className={`relative w-full h-full overflow-hidden bg-black ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block"
                style={{ width: "100%", height: "100%" }}
            />

            {/* Optional Loading State or Fallback Image could go here */}
        </div>
    );
}
