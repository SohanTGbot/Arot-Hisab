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
import { PremiumInput } from "@/components/ui/premium-input";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";

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
        <div className="w-full max-w-md mx-auto relative z-10 px-4 sm:px-0">
            <SpotlightCard className="p-6 md:p-8 border-white/5 bg-slate-900/40 backdrop-blur-md">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center space-y-4"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-cyan-500/20 blur-xl animate-pulse-slow rounded-full" />
                                <div className="relative flex justify-center">
                                    <Image
                                        src="/logo.png"
                                        alt="Arot Hisab"
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-auto h-20 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <TextGenerateEffect words={t("auth.getStarted")} className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2" />
                            <p className="text-slate-400 text-sm">
                                {t("auth.subheader")}
                            </p>
                        </div>
                    </motion.div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <PremiumInput
                                id="fullName"
                                label={t("auth.fullName")}
                                icon={User}
                                register={register("fullName")}
                                error={errors.fullName}
                                placeholder="John Doe"
                            />

                            <PremiumInput
                                id="email"
                                label={t("auth.email")}
                                type="email"
                                icon={Mail}
                                register={register("email")}
                                error={errors.email}
                                placeholder="you@example.com"
                            />

                            <div className="space-y-4">
                                <PremiumInput
                                    id="password"
                                    label={t("auth.password")}
                                    type="password"
                                    icon={Lock}
                                    register={register("password")}
                                    error={errors.password}
                                    placeholder="••••••••"
                                />

                                <PremiumInput
                                    id="confirmPassword"
                                    label={t("auth.confirmPassword")}
                                    type="password"
                                    icon={Lock}
                                    register={register("confirmPassword")}
                                    error={errors.confirmPassword}
                                    placeholder="••••••••"
                                />

                                {/* Password Strength Meter */}
                                <div className="space-y-2">
                                    <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            className={cn(
                                                "h-full transition-all duration-500 shadow-[0_0_10px_currentColor]",
                                                strength <= 25 ? "bg-red-500 text-red-500" :
                                                    strength <= 50 ? "bg-orange-500 text-orange-500" :
                                                        strength <= 75 ? "bg-yellow-500 text-yellow-500" : "bg-cyan-500 text-cyan-500"
                                            )}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${strength}%` }}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {requirements.map((req, i) => (
                                            <div key={i} className="flex items-center gap-1 text-[10px] sm:text-xs">
                                                {req.re.test(password || "") ? (
                                                    <Check className="w-3 h-3 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                                                ) : (
                                                    <div className="w-3 h-3 rounded-full border border-slate-700" />
                                                )}
                                                <span className={cn(
                                                    "transition-colors duration-300",
                                                    req.re.test(password || "") ? "text-cyan-400 font-medium shadow-cyan-500/50" : "text-slate-500"
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
                            className="flex items-start space-x-3 group cursor-pointer"
                        >
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 accent-cyan-500 transition-all group-hover:border-cyan-500"
                                />
                            </div>
                            <label htmlFor="terms" className="text-xs text-slate-400 leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-hover:text-slate-300 transition-colors">
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
                                    "w-full h-14 text-lg font-bold transition-all duration-300 rounded-xl",
                                    "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:-translate-y-1 border border-white/10 relative overflow-hidden group",
                                    loading && "opacity-80 cursor-not-allowed"
                                )}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2 relative z-10">
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
                            <Link href="/auth/signin" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                                {t("auth.signIn")}
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </SpotlightCard>
        </div>
    );
}
