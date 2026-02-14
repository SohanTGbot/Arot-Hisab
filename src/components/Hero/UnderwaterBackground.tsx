"use client";

import React, { useRef, useEffect } from "react";

// --- Configuration ---
const CONFIG = {
    fishCount: 100, // Primary school
    bgFishCount: 200, // Background school (depth)
    heroFishSpeed: 0.8,
    schoolSpeed: 1.5,
    bubbleCount: 30,
};

// --- Helpers ---
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Boid Class (Schooling Fish) ---
class Boid {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    depth: number; // 0 (far) to 1 (near)
    type: 'primary' | 'background';

    constructor(w: number, h: number, type: 'primary' | 'background' = 'primary') {
        this.x = random(0, w);
        this.y = random(0, h);
        this.type = type;

        if (type === 'primary') {
            this.vx = random(-1, 1);
            this.vy = random(-0.5, 0.5);
            this.depth = random(0.4, 0.9);
            this.size = random(8, 14) * this.depth; // Increased size significantly
            // Primary: Blue/Cyan/White mix
            const tone = random(100, 255);
            this.color = `rgba(${tone}, ${tone}, 255, ${0.6 + this.depth * 0.4})`; // Slightly more opaque
        } else {
            // Background: Smaller, darker, slower
            this.vx = random(-0.5, 0.5);
            this.vy = random(-0.2, 0.2);
            this.depth = random(0.1, 0.4);
            this.size = random(3, 6); // Increased size
            this.color = `rgba(30, 41, 59, ${0.3 + this.depth * 0.3})`; // Slate-900ish
        }
    }

    update(w: number, h: number, mouse: { x: number, y: number } | null, boids: Boid[]) {
        // Flocking Forces
        let separationX = 0, separationY = 0;
        let alignX = 0, alignY = 0;
        let cohesionX = 0, cohesionY = 0;
        let count = 0;

        // Optimization: Background fish interact less/shorter range
        const range = (this.type === 'primary' ? 60 : 30) * this.depth;

        for (const other of boids) {
            // Optimization: interact mostly with own type
            if (other.type !== this.type) continue;

            const d = Math.hypot(this.x - other.x, this.y - other.y);
            if (other !== this && d < range) {
                separationX += (this.x - other.x) / d;
                separationY += (this.y - other.y) / d;
                alignX += other.vx;
                alignY += other.vy;
                cohesionX += other.x;
                cohesionY += other.y;
                count++;
            }
        }

        if (count > 0) {
            separationX /= count; separationY /= count;
            alignX /= count; alignY /= count;
            cohesionX = (cohesionX / count - this.x) / 50;
            cohesionY = (cohesionY / count - this.y) / 50;
        }

        // Interaction (Repel from mouse)
        if (mouse) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const d = Math.hypot(dx, dy);
            const repelRange = 150;
            if (d < repelRange) {
                const force = (repelRange - d) / repelRange;
                this.vx += (dx / d) * force * 0.8;
                this.vy += (dy / d) * force * 0.8;
            }
        }

        this.vx += separationX * 0.05 + alignX * 0.02 + cohesionX * 0.01;
        this.vy += separationY * 0.05 + alignY * 0.02 + cohesionY * 0.01;

        // Speed Limit
        const speed = Math.hypot(this.vx, this.vy);
        const limitSpeed = (this.type === 'primary' ? CONFIG.schoolSpeed : CONFIG.schoolSpeed * 0.6) * (0.5 + this.depth);
        if (speed > limitSpeed) {
            this.vx = (this.vx / speed) * limitSpeed;
            this.vy = (this.vy / speed) * limitSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Wrap
        if (this.x < -50) this.x = w + 50;
        if (this.x > w + 50) this.x = -50;
        if (this.y < -50) this.y = h + 50;
        if (this.y > h + 50) this.y = -50;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const angle = Math.atan2(this.vy, this.vx);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.fillStyle = this.color;

        // Draw Fish Body
        ctx.beginPath();
        // Nose is at (size, 0), Tail base at (-size, 0)
        // Upper curve
        ctx.moveTo(this.size, 0);
        ctx.quadraticCurveTo(0, -this.size * 0.6, -this.size, 0);
        // Lower curve
        ctx.quadraticCurveTo(0, this.size * 0.6, this.size, 0);
        ctx.fill();

        // Draw Tail
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.8, 0);
        ctx.lineTo(-this.size * 1.6, -this.size * 0.5);
        ctx.lineTo(-this.size * 1.6, this.size * 0.5);
        ctx.fill();

        ctx.restore();
    }
}

// --- Hero Fish Class (Spine Animation) ---
class HeroFish {
    x: number;
    y: number;
    joints: { x: number, y: number }[];
    angle: number;
    finPhase: number;
    targetY: number;
    scale: number;
    speed: number;

    constructor(w: number, h: number, scale: number = 1, speed: number = 1) {
        this.scale = scale;
        this.speed = speed;
        this.x = -200;
        this.y = random(h * 0.2, h * 0.8);
        this.targetY = this.y;
        this.angle = 0;
        this.finPhase = 0;
        this.joints = Array(12).fill({ x: this.x, y: this.y });
    }

    update(w: number, h: number, mouse: { x: number, y: number } | null) {
        // Swim right
        this.x += CONFIG.heroFishSpeed * this.speed;

        if (mouse && Math.abs(mouse.x - this.x) < 300) {
            this.targetY += (mouse.y - this.targetY) * 0.008;
        } else {
            this.targetY += Math.sin(this.x * 0.01) * 0.8;
        }

        this.y += (this.targetY - this.y) * 0.01;

        if (this.x > w + 300) {
            this.x = -300;
            this.y = random(h * 0.2, h * 0.8);
            this.targetY = this.y;
        }

        // Spine Logic
        this.joints[0] = { x: this.x, y: this.y };
        const segLen = 6 * this.scale;

        for (let i = 1; i < this.joints.length; i++) {
            const prev = this.joints[i - 1];
            const cur = this.joints[i];
            const dx = prev.x - cur.x;
            const dy = prev.y - cur.y;
            const angle = Math.atan2(dy, dx);
            const tx = prev.x - Math.cos(angle) * segLen;
            const ty = prev.y - Math.sin(angle) * segLen;
            this.joints[i] = { x: tx, y: ty };
        }

        this.angle = Math.atan2(this.joints[1].y - this.joints[0].y, this.joints[1].x - this.joints[0].x);
        this.finPhase += 0.15;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.joints[2].x, this.joints[2].y);
        ctx.rotate(this.angle + Math.PI);

        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";

        // Fins
        const finWag = Math.sin(this.finPhase) * 0.3;
        const finSize = 20 * this.scale;

        ctx.save();
        ctx.rotate(0.5 + finWag);
        ctx.beginPath(); ctx.ellipse(15 * this.scale, 5 * this.scale, finSize, finSize * 0.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.rotate(-0.5 - finWag);
        ctx.beginPath(); ctx.ellipse(15 * this.scale, -5 * this.scale, finSize, finSize * 0.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.restore();

        // Body
        ctx.beginPath();
        for (let i = 0; i < this.joints.length; i++) {
            const size = (12 - i) * 1.5 * this.scale;
            let a = 0;
            if (i < this.joints.length - 1) {
                a = Math.atan2(this.joints[i + 1].y - this.joints[i].y, this.joints[i + 1].x - this.joints[i].x);
            } else {
                a = Math.atan2(this.joints[i].y - this.joints[i - 1].y, this.joints[i].x - this.joints[i - 1].x);
            }
            a += Math.PI / 2;
            ctx.lineTo(this.joints[i].x + Math.cos(a) * size, this.joints[i].y + Math.sin(a) * size);
        }
        for (let i = this.joints.length - 1; i >= 0; i--) {
            const size = (12 - i) * 1.5 * this.scale;
            let a = 0;
            if (i < this.joints.length - 1) {
                a = Math.atan2(this.joints[i + 1].y - this.joints[i].y, this.joints[i + 1].x - this.joints[i].x);
            } else {
                a = Math.atan2(this.joints[i].y - this.joints[i - 1].y, this.joints[i].x - this.joints[i - 1].x);
            }
            a -= Math.PI / 2;
            ctx.lineTo(this.joints[i].x + Math.cos(a) * size, this.joints[i].y + Math.sin(a) * size);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// --- Main Component ---
export default function UnderwaterBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0, height = 0;
        let boids: Boid[] = [];
        let heroFish1: HeroFish;
        let heroFish2: HeroFish;
        let bubbles: { x: number, y: number, r: number, speed: number }[] = [];
        let mouse: { x: number, y: number } | null = null;
        let rays: number = 0;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            boids = [];
            // Primary School
            for (let i = 0; i < CONFIG.fishCount; i++) {
                boids.push(new Boid(width, height, 'primary'));
            }
            // Background School
            for (let i = 0; i < CONFIG.bgFishCount; i++) {
                boids.push(new Boid(width, height, 'background'));
            }

            heroFish1 = new HeroFish(width, height, 1.2, 1.0);
            heroFish2 = new HeroFish(width, height, 0.9, 1.3); // Smaller, faster
            heroFish2.x = -500; // Offset start

            bubbles = Array.from({ length: CONFIG.bubbleCount }, () => ({
                x: random(0, width),
                y: random(height, height * 2),
                r: random(1, 3),
                speed: random(0.5, 2)
            }));
        };

        const handleMove = (e: MouseEvent | TouchEvent) => {
            let cx, cy;
            if (e instanceof MouseEvent) {
                cx = e.clientX; cy = e.clientY;
            } else {
                cx = e.touches[0].clientX; cy = e.touches[0].clientY;
            }
            mouse = { x: cx, y: cy };
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchstart", handleMove);
        window.addEventListener("touchmove", handleMove);

        resize();

        const animate = () => {
            ctx.fillStyle = "#0f172a"; // Deep blue bg
            ctx.fillRect(0, 0, width, height);

            // Gradient Overlay (Vignette + Depth)
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, "#020617"); // Darker top
            gradient.addColorStop(1, "#1e293b"); // Lighter bottom
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Light Rays
            ctx.save();
            ctx.translate(width / 2, -100);
            ctx.rotate(Math.PI / 6);
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = "white";
            rays += 0.002;
            for (let i = 0; i < 5; i++) {
                const w = Math.sin(rays + i) * 100 + 150;
                ctx.fillRect(i * 200 - 500, 0, w, height * 2);
            }
            ctx.restore();

            // Bubbles
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "white";
            bubbles.forEach(b => {
                b.y -= b.speed;
                // Wobble
                const x = b.x + Math.sin(b.y * 0.05) * 2;
                ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
                if (b.y < -10) { b.y = height + 10; b.x = random(0, width); }
            });
            ctx.globalAlpha = 1;

            // Boids
            boids.forEach(b => {
                b.update(width, height, mouse, boids);
                b.draw(ctx);
            });

            // Hero Fish
            heroFish1.update(width, height, mouse);
            heroFish1.draw(ctx);

            heroFish2.update(width, height, mouse);
            heroFish2.draw(ctx);

            requestAnimationFrame(animate);
        };
        const raf = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchstart", handleMove);
            window.removeEventListener("touchmove", handleMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}
