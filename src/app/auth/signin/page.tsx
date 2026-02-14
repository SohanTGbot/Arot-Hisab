"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { signInWithEmail } from "@/lib/actions/auth";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, Fish } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassCard } from "@/components/ui/glass-card";

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useI18n();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: SignInFormData) => {
        setLoading(true);
        try {
            const result = await signInWithEmail(data);

            if (!result.success) {
                if (result.needsVerification) {
                    toast.error(result.error);
                    router.push('/auth/verify-email');
                    return;
                }
                throw new Error(result.error);
            }

            // Success Animation wait
            setTimeout(() => {
                toast.success("Welcome back!", {
                    description: "You have successfully signed in.",
                });
                router.push("/dashboard");
                router.refresh();
            }, 800);

        } catch (error: any) {
            toast.error(error.message || "Failed to sign in");
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
                        className="text-center space-y-4"
                    >
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group">
                                <Fish className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                                {t("auth.welcomeBack")}
                            </h2>
                            <p className="text-slate-400 text-xs tracking-wider uppercase font-medium">
                                {t("auth.welcomeBackDesc")}
                            </p>
                        </div>
                    </motion.div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <motion.div
                            className="space-y-5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassInput
                                id="email"
                                label={t("auth.emailOrPhone")}
                                type="email"
                                icon={Mail}
                                register={register("email")}
                                error={errors.email}
                                placeholder="user@example.com"
                            />

                            <div className="space-y-2">
                                <GlassInput
                                    id="password"
                                    label={t("auth.password")}
                                    type="password"
                                    icon={Lock}
                                    register={register("password")}
                                    error={errors.password}
                                    placeholder="••••••••"
                                />
                                <div className="flex justify-end">
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        {t("auth.forgotPasswordText")}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
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
                                    <span className="flex items-center justify-center gap-2 uppercase text-sm tracking-wide">
                                        {t("auth.signInBtn")}
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative py-2"
                    >
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-700/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-transparent px-2 text-slate-500 backdrop-blur-sm">
                                {t("auth.orContinueWith")}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                    >
                        <p className="text-sm text-slate-400">
                            {t("auth.dontHaveAccount")}{" "}
                            <Link href="/auth/signup" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors hover:underline">
                                {t("auth.signUp")}
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </GlassCard>
        </div>
    );
}
