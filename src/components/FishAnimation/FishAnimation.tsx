"use client";

import React, { useRef, useEffect } from "react";

// --- Types ---
interface Point {
    x: number;
    y: number;
}

interface Vector {
    x: number;
    y: number;
}

// --- Configuration ---
const CONFIG = {
    fishCount: 15, // Fewer fish, but higher quality
    fishSize: 1.5, // Global scale multiplier
    segmentCount: 12, // Number of spine segments
    segmentLength: 5,
    finSpeed: 0.15, // Fin oscillation speed
};

// --- Helper Functions ---
const dist = (p1: Point, p2: Point) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
const angle = (p1: Point, p2: Point) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

// --- Classes ---

class Spine {
    joints: Point[];
    angles: number[];
    length: number;

    constructor(x: number, y: number, count: number, length: number) {
        this.joints = Array(count).fill(0).map(() => ({ x, y }));
        this.angles = Array(count).fill(0);
        this.length = length;
    }

    update(headX: number, headY: number) {
        // Head follows the physics position
        this.joints[0].x = headX;
        this.joints[0].y = headY;

        // Inverse Kinematics (Chain)
        for (let i = 1; i < this.joints.length; i++) {
            const cur = this.joints[i];
            const prev = this.joints[i - 1];

            const a = angle(cur, prev);
            this.angles[i] = a;

            // Maintain fixed distance constraint (Segment Length)
            // Move current towards previous until distance is 'length'
            // Simple approach: Set position based on angle from previous
            cur.x = prev.x - Math.cos(a) * this.length;
            cur.y = prev.y - Math.sin(a) * this.length;
        }
    }
}

class RealisticFish {
    pos: Vector;
    vel: Vector;
    acc: Vector;
    maxSpeed: number;
    maxForce: number;
    spine: Spine;
    colorBody: string;
    colorFin: string;
    sizeScale: number;
    finPhase: number;

    constructor(w: number, h: number) {
        this.pos = { x: Math.random() * w, y: Math.random() * h };
        const a = Math.random() * Math.PI * 2;
        this.vel = { x: Math.cos(a), y: Math.sin(a) };
        this.acc = { x: 0, y: 0 };

        // Varying personalities
        this.sizeScale = (Math.random() * 0.5 + 0.8) * CONFIG.fishSize;
        this.maxSpeed = (Math.random() * 0.5 + 1.5);
        this.maxForce = 0.05;

        this.spine = new Spine(this.pos.x, this.pos.y, CONFIG.segmentCount, CONFIG.segmentLength * this.sizeScale);

        // Realistic Koi Colors
        const palettes = [
            { body: "#fca5a5", fin: "#fecaca" }, // Red/White
            { body: "#fda4af", fin: "#fce7f3" }, // Pink
            { body: "#fb923c", fin: "#fdba74" }, // Orange (Gold)
            { body: "#e2e8f0", fin: "#f1f5f9" }, // White/Silver
            { body: "#fcd34d", fin: "#fde68a" }, // Yellow
        ];
        const p = palettes[Math.floor(Math.random() * palettes.length)];
        this.colorBody = p.body;
        this.colorFin = p.fin;

        this.finPhase = Math.random() * Math.PI * 2;
    }

    applyBehaviors(fish: RealisticFish[], target: Point | null, isTouching: boolean) {
        // Flocking
        const sep = this.separate(fish);
        const ali = this.align(fish);
        const coh = this.cohesion(fish);

        // Interaction
        const mouse = this.interact(target);

        // Weights
        sep.x *= 2.5; sep.y *= 2.5;
        ali.x *= 1.0; ali.y *= 1.0;
        coh.x *= 1.0; coh.y *= 1.0;
        mouse.x *= 3.0; mouse.y *= 3.0;

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
        this.applyForce(mouse);
    }

    applyForce(force: Vector) {
        this.acc.x += force.x;
        this.acc.y += force.y;
    }

    // Steering Behaviors
    separate(fish: RealisticFish[]): Vector {
        const desiredSeparation = 40 * this.sizeScale;
        let sum = { x: 0, y: 0 };
        let count = 0;
        fish.forEach(other => {
            const d = dist(this.pos, other.pos);
            if (other !== this && d < desiredSeparation) {
                const diff = { x: this.pos.x - other.pos.x, y: this.pos.y - other.pos.y };
                sum.x += diff.x / d;
                sum.y += diff.y / d;
                count++;
            }
        });
        if (count > 0) {
            sum.x /= count; sum.y /= count;
            const mag = Math.hypot(sum.x, sum.y);
            if (mag > 0) {
                sum.x = (sum.x / mag) * this.maxSpeed;
                sum.y = (sum.y / mag) * this.maxSpeed;
                sum.x -= this.vel.x;
                sum.y -= this.vel.y;
            }
        }
        return sum;
    }

    align(fish: RealisticFish[]): Vector {
        const neighborDist = 80;
        let sum = { x: 0, y: 0 };
        let count = 0;
        fish.forEach(other => {
            const d = dist(this.pos, other.pos);
            if (other !== this && d < neighborDist) {
                sum.x += other.vel.x;
                sum.y += other.vel.y;
                count++;
            }
        });
        if (count > 0) {
            sum.x /= count; sum.y /= count;
            const mag = Math.hypot(sum.x, sum.y);
            if (mag > 0) {
                sum.x = (sum.x / mag) * this.maxSpeed;
                sum.y = (sum.y / mag) * this.maxSpeed;
                sum.x -= this.vel.x;
                sum.y -= this.vel.y;
            }
        }
        return sum;
    }

    cohesion(fish: RealisticFish[]): Vector {
        const neighborDist = 80;
        let sum = { x: 0, y: 0 };
        let count = 0;
        fish.forEach(other => {
            const d = dist(this.pos, other.pos);
            if (other !== this && d < neighborDist) {
                sum.x += other.pos.x;
                sum.y += other.pos.y;
                count++;
            }
        });
        if (count > 0) {
            sum.x /= count; sum.y /= count;
            const desiredX = sum.x - this.pos.x;
            const desiredY = sum.y - this.pos.y;
            const mag = Math.hypot(desiredX, desiredY);
            if (mag > 0) {
                const sx = (desiredX / mag) * this.maxSpeed;
                const sy = (desiredY / mag) * this.maxSpeed;
                return { x: sx - this.vel.x, y: sy - this.vel.y };
            }
        }
        return { x: 0, y: 0 };
    }

    interact(target: Point | null): Vector {
        if (!target) return { x: 0, y: 0 };
        const d = dist(this.pos, target);
        if (d < 300) {
            // Seek
            const desiredX = target.x - this.pos.x;
            const desiredY = target.y - this.pos.y;
            const mag = Math.hypot(desiredX, desiredY);
            // Arrive
            let speed = this.maxSpeed * 2.5; // Sprint
            if (d < 50) speed = (d / 50) * this.maxSpeed;

            const sx = (desiredX / mag) * speed;
            const sy = (desiredY / mag) * speed;
            return { x: sx - this.vel.x, y: sy - this.vel.y };
        }
        return { x: 0, y: 0 };
    }

    update(w: number, h: number) {
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        // Speed Limit
        const speed = Math.hypot(this.vel.x, this.vel.y);
        if (speed > this.maxSpeed) {
            this.vel.x = (this.vel.x / speed) * this.maxSpeed;
            this.vel.y = (this.vel.y / speed) * this.maxSpeed;
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // Wrap
        const buffer = 50 * this.sizeScale;
        if (this.pos.x < -buffer) this.pos.x = w + buffer;
        if (this.pos.x > w + buffer) this.pos.x = -buffer;
        if (this.pos.y < -buffer) this.pos.y = h + buffer;
        if (this.pos.y > h + buffer) this.pos.y = -buffer;

        this.acc.x = 0;
        this.acc.y = 0;

        // Update Spine
        this.spine.update(this.pos.x, this.pos.y);

        // Animate fins
        this.finPhase += CONFIG.finSpeed;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const joints = this.spine.joints;
        const angles = this.spine.angles;

        // Draw Shadow (offset)
        ctx.save();
        ctx.translate(10, 10);
        ctx.filter = "blur(4px)";
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.drawBodyPath(ctx, joints);
        ctx.fill();
        ctx.restore();

        // Draw Fins (Pectoral)
        const head = joints[0];
        const headAngle = Math.atan2(this.vel.y, this.vel.x);
        const finOffset = Math.sin(this.finPhase) * 0.5;

        ctx.save();
        ctx.translate(head.x, head.y);
        ctx.rotate(headAngle);

        // Left Fin
        ctx.save();
        ctx.translate(5 * this.sizeScale, 5 * this.sizeScale);
        ctx.rotate(Math.PI / 3 + finOffset);
        ctx.fillStyle = this.colorFin;
        ctx.beginPath();
        ctx.ellipse(10 * this.sizeScale, 0, 12 * this.sizeScale, 5 * this.sizeScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Right Fin
        ctx.save();
        ctx.translate(5 * this.sizeScale, -5 * this.sizeScale);
        ctx.rotate(-Math.PI / 3 - finOffset);
        ctx.fillStyle = this.colorFin;
        ctx.beginPath();
        ctx.ellipse(10 * this.sizeScale, 0, 12 * this.sizeScale, 5 * this.sizeScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.restore();

        // Draw Body (Skin)
        ctx.fillStyle = this.colorBody;
        this.drawBodyPath(ctx, joints);
        ctx.fill();

        // Draw Eyes
        ctx.save();
        ctx.translate(head.x, head.y);
        ctx.rotate(headAngle);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(8 * this.sizeScale, 4 * this.sizeScale, 1.5 * this.sizeScale, 0, Math.PI * 2);
        ctx.arc(8 * this.sizeScale, -4 * this.sizeScale, 1.5 * this.sizeScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawBodyPath(ctx: CanvasRenderingContext2D, joints: Point[]) {
        const widths = [8, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2].map(w => w * this.sizeScale);

        ctx.beginPath();

        // Right side of body
        for (let i = 0; i < joints.length; i++) {
            const angle = (i === 0)
                ? Math.atan2(this.vel.y, this.vel.x)
                : Math.atan2(joints[i].y - joints[i - 1].y, joints[i].x - joints[i - 1].x);

            const perp = angle + Math.PI / 2;
            const x = joints[i].x + Math.cos(perp) * widths[i];
            const y = joints[i].y + Math.sin(perp) * widths[i];

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        // Left side (reverse)
        for (let i = joints.length - 1; i >= 0; i--) {
            const angle = (i === 0)
                ? Math.atan2(this.vel.y, this.vel.x)
                : Math.atan2(joints[i].y - joints[i - 1].y, joints[i].x - joints[i - 1].x);

            const perp = angle - Math.PI / 2;
            const x = joints[i].x + Math.cos(perp) * widths[i];
            const y = joints[i].y + Math.sin(perp) * widths[i];

            ctx.lineTo(x, y);
        }

        ctx.closePath();
    }
}

// --- Effects ---
interface Ripple {
    x: number;
    y: number;
    r: number; // radius
    o: number; // opacity
}

// --- Main Component ---
interface FishAnimationProps {
    className?: string; // Kept for compatibility
    frameCount?: number; // Kept (unused)
}

export default function FishAnimation({ className = "" }: FishAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let fishArray: RealisticFish[] = [];
        let ripples: Ripple[] = [];
        let animationFrameId: number;
        let target: Point | null = null;
        let isTouching = false;

        const handleResize = () => {
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            if (fishArray.length === 0) {
                for (let i = 0; i < CONFIG.fishCount; i++) {
                    fishArray.push(new RealisticFish(width, height));
                }
            }
        };

        const handleInteraction = (x: number, y: number, touching: boolean) => {
            const rect = canvas.getBoundingClientRect();
            target = { x: x - rect.left, y: y - rect.top };
            isTouching = touching;
            // Spawn ripple
            if (Math.random() > 0.8) {
                ripples.push({ x: target.x, y: target.y, r: 5, o: 0.6 });
            }
        };

        const handleEnd = () => { target = null; isTouching = false; };

        // Event Listeners
        window.addEventListener("resize", handleResize);
        container.addEventListener("mousemove", e => handleInteraction(e.clientX, e.clientY, false));
        container.addEventListener("mouseleave", handleEnd);
        container.addEventListener("touchmove", e => {
            e.preventDefault();
            handleInteraction(e.touches[0].clientX, e.touches[0].clientY, true);
        }, { passive: false });
        container.addEventListener("touchstart", e => {
            // e.preventDefault();
            handleInteraction(e.touches[0].clientX, e.touches[0].clientY, true);
        }, { passive: false });
        container.addEventListener("touchend", handleEnd);

        // Init
        handleResize();

        // Loop
        const animate = () => {
            const { width, height } = container.getBoundingClientRect();

            ctx.clearRect(0, 0, width, height);

            // 1. Draw Environment (Caustics simulation)
            // Simple "Light Ray" overlay
            // We can use a gradient or just nothing for transparency

            // 2. Draw Ripples
            ctx.lineWidth = 2;
            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${r.o})`;
                ctx.stroke();
                r.r += 2;
                r.o -= 0.01;
                if (r.o <= 0) ripples.splice(i, 1);
            }

            // 3. Draw Fish
            fishArray.forEach(f => {
                f.applyBehaviors(fishArray, target, isTouching);
                f.update(width, height);
                f.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            // remove others...
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
