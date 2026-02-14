import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

export interface GlassInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: { message?: string };
    register?: any;
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
    ({ className, type, label, icon: Icon, error, register, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword ? (showPassword ? "text" : "password") : type;

        // Handle ref merging
        const { ref: registerRef, ...registerProps } = register || {};

        const combinedRef = (node: HTMLInputElement) => {
            // Handle register ref
            if (typeof registerRef === 'function') {
                registerRef(node);
            } else if (registerRef) {
                registerRef.current = node;
            }

            // Handle forwarded ref
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
        };

        return (
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">
                    {label}
                </label>
                <div className="relative group">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                    <input
                        {...registerProps}
                        {...props}
                        type={inputType}
                        ref={combinedRef}
                        className={cn(
                            "w-full bg-slate-900/40 border border-white/5 rounded-xl px-4 py-3.5 text-slate-100 placeholder:text-slate-600",
                            "transition-all duration-300",
                            "group-hover:bg-slate-900/60 group-hover:border-white/10",
                            "focus:outline-none focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20",
                            Icon && "pl-12",
                            isPassword && "pr-12",
                            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
                            className
                        )}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    )}
                </div>
                {error?.message && (
                    <p className="text-xs text-red-500 ml-1 animate-in slide-in-from-top-1 fade-in-0">
                        {error.message}
                    </p>
                )}
            </div>
        );
    }
);

GlassInput.displayName = "GlassInput";

export { GlassInput };
