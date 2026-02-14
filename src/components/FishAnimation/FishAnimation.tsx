"use client";

import React, { useRef, useEffect } from "react";

interface Point {
    x: number;
    y: number;
}

class Fish {
    x: number;
    y: number;
    vx: number;
    vy: number;
    ax: number;
    ay: number;
    size: number;
    speed: number;
    color: string;
    canvasWidth: number;
    canvasHeight: number;
    angle: number;
    tailO: number; // Tail oscillation offset

    constructor(w: number, h: number) {
        this.canvasWidth = w;
        this.canvasHeight = h;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.ax = 0;
        this.ay = 0;
        this.size = Math.random() * 3 + 3; // 3-6
        this.speed = Math.random() * 1.5 + 2; // 2-3.5
        // Electric/Neon colors for premium feel
        const colors = ["#22d3ee", "#60a5fa", "#a78bfa", "#2dd4bf", "#f472b6"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = 0;
        this.tailO = Math.random() * Math.PI * 2;
    }

    update(fishArray: Fish[], target: Point | null, isTouching: boolean) {
        // Flocking Forces
        const separationRange = 30; // Personal space
        const alignRange = 60;
        const cohesionRange = 60;

        let sepX = 0, sepY = 0, sepCount = 0;
        let alignX = 0, alignY = 0, alignCount = 0;
        let cohX = 0, cohY = 0, cohCount = 0;

        fishArray.forEach((other) => {
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (other !== this && dist < separationRange) {
                sepX += (this.x - other.x) / dist;
                sepY += (this.y - other.y) / dist;
                sepCount++;
            }
            if (other !== this && dist < alignRange) {
                alignX += other.vx;
                alignY += other.vy;
                alignCount++;
            }
            if (other !== this && dist < cohesionRange) {
                cohX += other.x;
                cohY += other.y;
                cohCount++;
            }
        });

        if (sepCount > 0) { sepX /= sepCount; sepY /= sepCount; }
        if (alignCount > 0) { alignX /= alignCount; alignY /= alignCount; }
        if (cohCount > 0) {
            cohX = (cohX / cohCount - this.x);
            cohY = (cohY / cohCount - this.y);
        }

        // Target Interaction (Mouse or Touch)
        let targetX = 0, targetY = 0;
        if (target) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Interaction Radius
            const radius = isTouching ? 300 : 250;

            if (dist < radius) {
                // ATTRACTION force (Follow cursor/touch)
                // Stronger when further away (within radius), weaker when close to avoid overlapping
                const force = (dist / radius);
                targetX = (dx / dist) * force * 2.5;
                targetY = (dy / dist) * force * 2.5;
            }
        }

        // Apply Forces
        // Increased separation to prevent clumping when following cursor
        this.ax += sepX * 3.5 + alignX * 1.0 + cohX * 0.5 + targetX;
        this.ay += sepY * 3.5 + alignY * 1.0 + cohY * 0.5 + targetY;

        // Damping and Speed Limits
        this.vx += this.ax * 0.05;
        this.vy += this.ay * 0.05;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = this.speed * (isTouching ? 1.5 : 1); // Swim faster on touch

        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        } else if (speed < 1) {
            this.vx = (this.vx / speed) * 1;
            this.vy = (this.vy / speed) * 1;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Smooth rotation
        const desiredAngle = Math.atan2(this.vy, this.vx);
        // Simple lerp for angle is tricky due to wrap-around (-PI to PI), 
        // using exact velocity angle is usually fine for fish
        this.angle = desiredAngle;

        this.ax = 0;
        this.ay = 0;

        // Wrap Around Screen
        if (this.x < -20) this.x = this.canvasWidth + 20;
        if (this.x > this.canvasWidth + 20) this.x = -20;
        if (this.y < -20) this.y = this.canvasHeight + 20;
        if (this.y > this.canvasHeight + 20) this.y = -20;
    }

    draw(ctx: CanvasRenderingContext2D, elapsed: number) {
        // Tail oscillation speed increases with speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const tailAngle = Math.sin(elapsed * (0.1 + speed * 0.05) + this.tailO) * 0.4;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        // Draw Organic Fish Body
        ctx.beginPath();
        ctx.moveTo(this.size * 2, 0); // Nose

        // Body curves
        ctx.bezierCurveTo(this.size, -this.size, -this.size, -this.size, -this.size * 1.5, 0);
        ctx.bezierCurveTo(-this.size, this.size, this.size, this.size, this.size * 2, 0);
        ctx.fill();

        // Tail
        ctx.save();
        ctx.translate(-this.size * 1.5, 0);
        ctx.rotate(tailAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.size * 1.5, -this.size * 0.8);
        ctx.lineTo(-this.size * 1, 0);
        ctx.lineTo(-this.size * 1.5, this.size * 0.8);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.restore();

        ctx.restore();
    }
}

interface Ripple {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

interface FishAnimationProps {
    frameCount?: number;
    className?: string;
}

export default function FishAnimation({
    frameCount = 40,
    className = "",
}: FishAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let fishArray: Fish[] = [];
        let ripples: Ripple[] = [];
        let animationFrameId: number;
        let target: Point | null = null;
        let isTouching = false;
        let frame = 0;

        const handleResize = () => {
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            fishArray.forEach(f => {
                f.canvasWidth = width;
                f.canvasHeight = height;
            });

            if (fishArray.length === 0) {
                // Initialize fish random positions
                for (let i = 0; i < frameCount; i++) {
                    fishArray.push(new Fish(width, height));
                }
            }
        };

        // Mouse Handlers
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            target = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            isTouching = false;
        };

        const handleMouseLeave = () => { target = null; };

        // Touch Handlers
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault(); // Prevent scrolling while interacting
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            target = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
            isTouching = true;
        };

        const handleTouchStart = (e: TouchEvent) => {
            // e.preventDefault(); // Optional: might want to allow scroll start
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            target = { x, y };
            isTouching = true;

            // Spawn Ripple
            ripples.push({ x, y, radius: 10, opacity: 1 });
        };

        const handleTouchEnd = () => {
            target = null;
            isTouching = false;
        };

        const animate = () => {
            const { width, height } = container.getBoundingClientRect();
            ctx.clearRect(0, 0, width, height);

            // Draw Ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(100, 200, 255, ${r.opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                r.radius += 2;
                r.opacity -= 0.02;

                if (r.opacity <= 0) {
                    ripples.splice(i, 1);
                }
            }

            // Update & Draw Fish
            fishArray.forEach(fish => {
                fish.update(fishArray, target, isTouching);
                fish.draw(ctx, frame);
            });

            frame++;
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", handleResize);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        // Passive false for touch to allow prevention of default if needed
        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        container.addEventListener("touchend", handleTouchEnd);


        handleResize();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
            cancelAnimationFrame(animationFrameId);
        };
    }, [frameCount]);

    return (
        <div ref={containerRef} className={`w-full h-full ${className} touch-none`}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
