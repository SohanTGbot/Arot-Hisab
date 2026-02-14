import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export interface PremiumInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: { message?: string };
    register?: any;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
    ({ className, type, label, icon: Icon, error, register, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const [focused, setFocused] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword ? (showPassword ? "text" : "password") : type;
        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        // Handle ref merging
        const { ref: registerRef, ...registerProps } = register || {};

        const combinedRef = (node: HTMLInputElement) => {
            if (typeof registerRef === 'function') registerRef(node);
            else if (registerRef) registerRef.current = node;

            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        };

        function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left);
            mouseY.set(clientY - top);
        }

        return (
            <div className="space-y-2 group/input">
                <label className={cn(
                    "text-sm font-medium ml-1 transition-colors duration-300",
                    focused ? "text-cyan-400" : "text-slate-400",
                    error && "text-red-400"
                )}>
                    {label}
                </label>
                <div
                    className="relative group rounded-xl bg-slate-900/40 p-[1px] overflow-hidden transition-all duration-300 hover:bg-slate-800/60"
                    onMouseMove={handleMouseMove}
                >
                    {/* Animated Border Gradient */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                  650px circle at ${mouseX}px ${mouseY}px,
                                  rgba(6, 182, 212, 0.4),
                                  transparent 80%
                                )
                            `,
                        }}
                    />
                    {/* Focus Glow */}
                    <div className={cn(
                        "absolute inset-0 rounded-xl bg-cyan-500/20 blur-md transition-opacity duration-500",
                        focused ? "opacity-100" : "opacity-0"
                    )} />

                    <div className="relative flex items-center bg-slate-950/80 rounded-xl overflow-hidden backdrop-blur-sm h-full">
                        {Icon && (
                            <div className={cn(
                                "absolute left-4 transition-colors duration-300",
                                focused ? "text-cyan-400" : "text-slate-500",
                                error && "text-red-400"
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        <input
                            {...registerProps}
                            {...props}
                            type={inputType}
                            ref={combinedRef}
                            onFocus={(e) => {
                                setFocused(true);
                                props.onFocus?.(e);
                            }}
                            onBlur={(e) => {
                                setFocused(false);
                                props.onBlur?.(e);
                            }}
                            className={cn(
                                "w-full bg-transparent border-none px-4 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none ring-0",
                                "transition-all duration-300",
                                Icon && "pl-12",
                                isPassword && "pr-12",
                                className
                            )}
                        />
                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-slate-500 hover:text-cyan-400 transition-colors p-1"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
                {error?.message && (
                    <p className="text-xs text-red-400 ml-1 animate-in slide-in-from-top-1 fade-in-0 flex items-center gap-1 font-medium">
                        <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                        {error.message}
                    </p>
                )}
            </div>
        );
    }
);

PremiumInput.displayName = "PremiumInput";

export { PremiumInput };
