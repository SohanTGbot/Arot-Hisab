"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface AnimatedButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    disabled?: boolean;
    ripple?: boolean;
}

export function AnimatedButton({
    children,
    onClick,
    variant = "default",
    size = "default",
    className,
    disabled = false,
    ripple = true,
}: AnimatedButtonProps) {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (ripple && !disabled) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now();

            setRipples((prev) => [...prev, { x, y, id }]);

            setTimeout(() => {
                setRipples((prev) => prev.filter((r) => r.id !== id));
            }, 600);
        }

        onClick?.();
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            disabled={disabled}
            className={cn("relative overflow-hidden", className)}
        >
            {ripple && ripples.map((ripple) => (
                <motion.span
                    key={ripple.id}
                    className="absolute rounded-full bg-current opacity-30"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                    }}
                    initial={{ width: 0, height: 0, x: "-50%", y: "-50%" }}
                    animate={{ width: 300, height: 300 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            ))}
            <span className="relative z-10">{children}</span>
        </Button>
    );
}

interface FloatingActionButtonProps {
    icon: ReactNode;
    onClick: () => void;
    label?: string;
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function FloatingActionButton({
    icon,
    onClick,
    label,
    position = "bottom-right",
}: FloatingActionButtonProps) {
    const positionClasses = {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
    };

    return (
        <motion.button
            onClick={onClick}
            className={cn(
                "fixed z-50 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow",
                "flex items-center gap-2 p-4",
                positionClasses[position]
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            aria-label={label}
        >
            {icon}
            {label && (
                <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    whileHover={{ width: "auto", opacity: 1 }}
                    className="overflow-hidden whitespace-nowrap text-sm font-medium"
                >
                    {label}
                </motion.span>
            )}
        </motion.button>
    );
}

interface PulseIconProps {
    icon: ReactNode;
    color?: string;
}

export function PulseIcon({ icon, color = "bg-primary" }: PulseIconProps) {
    return (
        <div className="relative inline-flex">
            {icon}
            <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", color)} />
                <span className={cn("relative inline-flex rounded-full h-3 w-3", color)} />
            </span>
        </div>
    );
}
