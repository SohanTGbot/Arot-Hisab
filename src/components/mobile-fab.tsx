"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileFABProps {
    onClick: () => void;
    icon?: ReactNode;
    label?: string;
    className?: string;
}

export function MobileFAB({
    onClick,
    icon = <Plus className="h-6 w-6" />,
    label = "Add",
    className,
}: MobileFABProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={cn(
                "fixed bottom-20 right-4 z-40 md:hidden",
                "h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg",
                "flex items-center justify-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "active:shadow-md transition-shadow",
                className
            )}
            aria-label={label}
        >
            {icon}
        </motion.button>
    );
}

interface ExtendedMobileFABProps extends MobileFABProps {
    text: string;
}

export function ExtendedMobileFAB({
    onClick,
    icon = <Plus className="h-6 w-6" />,
    text,
    className,
}: ExtendedMobileFABProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "fixed bottom-20 right-4 z-40 md:hidden",
                "h-14 px-6 rounded-full bg-primary text-primary-foreground shadow-lg",
                "flex items-center justify-center gap-2",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "active:shadow-md transition-shadow",
                "font-semibold",
                className
            )}
        >
            {icon}
            <span>{text}</span>
        </motion.button>
    );
}
