"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { signUpWithEmail } from "@/lib/actions/auth";
import { motion } from "framer-motion";
import { Loader2, Check, User, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassCard } from "@/components/ui/glass-card";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useI18n();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
    });

    const password = watch("password");

    // Password Challenge Logic
    const [strength, setStrength] = useState(0);
    const [requirements, setRequirements] = useState([
        { re: /.{8,}/, label: "At least 8 characters" },
        { re: /[0-9]/, label: "Contains number" },
        { re: /[a-z]/, label: "Contains lowercase" },
        { re: /[A-Z]/, label: "Contains uppercase" },
    ]);

    useEffect(() => {
        if (!password) {
            setStrength(0);
            return;
        }
        const matches = requirements.filter((req) => req.re.test(password)).length;
        setStrength((matches / requirements.length) * 100);
    }, [password]);

    const onSubmit = async (data: SignUpFormData) => {
        setLoading(true);
        try {
            const result = await signUpWithEmail(data);

            if (!result.success) {
                throw new Error(result.error);
            }

            setTimeout(() => {
                toast.success("Account created successfully!", {
                    description: "Please check your email to verify your account."
                });
                router.push("/auth/signin");
            }, 800);

        } catch (error: any) {
            toast.error(error.message || "Failed to create account");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <GlassCard>
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center space-y-2"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-bold text-xl">
                                A
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                            {t("auth.getStarted")}
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {t("auth.subheader")}
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassInput
                                id="fullName"
                                label={t("auth.fullName")}
                                icon={User}
                                register={register("fullName")}
                                error={errors.fullName}
                                placeholder="John Doe"
                            />

                            <GlassInput
                                id="email"
                                label={t("auth.email")}
                                type="email"
                                icon={Mail}
                                register={register("email")}
                                error={errors.email}
                                placeholder="you@example.com"
                            />

                            <div className="space-y-4">
                                <GlassInput
                                    id="password"
                                    label={t("auth.password")}
                                    type="password"
                                    icon={Lock}
                                    register={register("password")}
                                    error={errors.password}
                                    placeholder="••••••••"
                                />

                                {/* Password Strength Meter */}
                                <div className="space-y-2">
                                    <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className={cn(
                                                "h-full transition-all duration-300",
                                                strength <= 25 ? "bg-red-500" :
                                                    strength <= 50 ? "bg-orange-500" :
                                                        strength <= 75 ? "bg-yellow-500" : "bg-green-500"
                                            )}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${strength}%` }}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {requirements.map((req, i) => (
                                            <div key={i} className="flex items-center gap-1 text-[10px] sm:text-xs">
                                                {req.re.test(password || "") ? (
                                                    <Check className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <div className="w-3 h-3 rounded-full border border-slate-700" />
                                                )}
                                                <span className={cn(
                                                    "transition-colors",
                                                    req.re.test(password || "") ? "text-green-400 font-medium" : "text-slate-500"
                                                )}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-start space-x-3"
                        >
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                />
                            </div>
                            <label htmlFor="terms" className="text-xs text-slate-400 leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t("auth.termsText")}
                            </label>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                type="submit"
                                disabled={loading || !isValid}
                                className={cn(
                                    "w-full h-12 text-base font-semibold transition-all duration-300 rounded-xl",
                                    "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5",
                                    loading && "opacity-80 cursor-not-allowed"
                                )}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {t("auth.createAccountBtn")}
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center pt-2"
                    >
                        <p className="text-sm text-slate-400">
                            {t("auth.alreadyHaveAccount")}{" "}
                            <Link href="/auth/signin" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors hover:underline">
                                {t("auth.signIn")}
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </GlassCard>
        </div>
    );
}
