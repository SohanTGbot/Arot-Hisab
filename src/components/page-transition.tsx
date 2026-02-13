"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

const slideVariants = {
    initial: {
        opacity: 0,
        x: 100,
    },
    enter: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        x: -100,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

const fadeVariants = {
    initial: {
        opacity: 0,
    },
    enter: {
        opacity: 1,
        transition: {
            duration: 0.4,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

type TransitionType = "fade" | "slide" | "default";

interface PageTransitionProps {
    children: ReactNode;
    type?: TransitionType;
}

export function PageTransition({ children, type = "default" }: PageTransitionProps) {
    const pathname = usePathname();

    const getVariants = () => {
        switch (type) {
            case "fade":
                return fadeVariants;
            case "slide":
                return slideVariants;
            default:
                return pageVariants;
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={getVariants()}
                initial="initial"
                animate="enter"
                exit="exit"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Progress bar component for route changes
export function RouteProgressBar() {
    const pathname = usePathname();

    return (
        <AnimatePresence>
            <motion.div
                key={pathname}
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 1, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            />
        </AnimatePresence>
    );
}
