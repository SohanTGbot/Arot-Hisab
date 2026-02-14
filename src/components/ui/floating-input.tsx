"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: FieldError;
    register: UseFormRegisterReturn;
}

export const FloatingInput = ({ label, id, error, type = "text", register, ...props }: FloatingInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="relative group">
            <input
                {...register}
                {...props}
                type={inputType}
                id={id}
                className={cn(
                    "block px-4 pb-2.5 pt-5 w-full text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-cyan-500 peer transition-colors duration-200",
                    error && "border-red-500 focus:border-red-500"
                )}
                placeholder=" "
            />
            <label
                htmlFor={id}
                className={cn(
                    "absolute text-sm text-slate-500 duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-cyan-600 peer-focus:dark:text-cyan-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 pointer-events-none bg-transparent select-none",
                    error && "text-red-500 peer-focus:text-red-500"
                )}
            >
                {label}
            </label>

            {/* Password Toggle */}
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-1 mt-1.5 text-xs text-red-500 font-medium ml-1"
                    >
                        <AlertCircle className="w-3 h-3" />
                        <span>{error.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
