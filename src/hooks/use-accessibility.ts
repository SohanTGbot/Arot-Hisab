import { useEffect, RefObject } from "react";

// Hook for managing focus trap in modals
export function useFocusTrap(
    ref: RefObject<HTMLElement>,
    isActive: boolean
) {
    useEffect(() => {
        if (!isActive || !ref.current) return;

        const element = ref.current;
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0] as HTMLElement;
        const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable?.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable?.focus();
                    e.preventDefault();
                }
            }
        };

        element.addEventListener("keydown", handleTabKey);
        firstFocusable?.focus();

        return () => {
            element.removeEventListener("keydown", handleTabKey);
        };
    }, [isActive, ref]);
}

// Hook for keyboard shortcuts
export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    options: {
        ctrl?: boolean;
        shift?: boolean;
        alt?: boolean;
    } = {}
) {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const matchesModifiers =
                (!options.ctrl || e.ctrlKey || e.metaKey) &&
                (!options.shift || e.shiftKey) &&
                (!options.alt || e.altKey);

            if (e.key.toLowerCase() === key.toLowerCase() && matchesModifiers) {
                e.preventDefault();
                callback();
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [key, callback, options]);
}

// Hook for detecting reduced motion preference
export function useReducedMotion() {
    const prefersReducedMotion =
        typeof window !== "undefined"
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false;

    return prefersReducedMotion;
}

// Hook for skip navigation
export function useSkipNavigation() {
    const skipToMainContent = () => {
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView();
        }
    };

    return { skipToMainContent };
}

// Hook for announcement for screen readers
export function useAnnouncement() {
    useEffect(() => {
        // Create announcement region if it doesn't exist
        if (!document.getElementById("sr-announcer")) {
            const announcer = document.createElement("div");
            announcer.id = "sr-announcer";
            announcer.setAttribute("role", "status");
            announcer.setAttribute("aria-live", "polite");
            announcer.setAttribute("aria-atomic", "true");
            announcer.className = "sr-only";
            document.body.appendChild(announcer);
        }
    }, []);

    const announce = (message: string) => {
        const announcer = document.getElementById("sr-announcer");
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = "";
            }, 1000);
        }
    };

    return { announce };
}
