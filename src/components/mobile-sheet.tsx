"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    description?: string;
}

export function MobileSheet({
    isOpen,
    onClose,
    children,
    title,
    description,
}: MobileSheetProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md",
                            "max-h-[85vh] rounded-t-2xl bg-background shadow-lg",
                            "overflow-hidden flex flex-col"
                        )}
                    >
                        {/* Handle */}
                        <div className="flex items-center justify-center py-2">
                            <div className="w-12 h-1.5 rounded-full bg-muted" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <div className="flex-1">
                                {title && (
                                    <h2 className="text-lg font-semibold">{title}</h2>
                                )}
                                {description && (
                                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto overscroll-contain p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
