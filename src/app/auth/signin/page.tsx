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
import { PremiumInput } from "@/components/ui/premium-input";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";

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
        <div className="w-full max-w-md mx-auto relative z-10 px-4 sm:px-0">
            <SpotlightCard className="p-6 md:p-8 border-white/5 bg-slate-900/40 backdrop-blur-md">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center space-y-6"
                    >
                        <div className="flex justify-center">
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
                            <TextGenerateEffect words={t("auth.welcomeBack")} className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2" />
                            <p className="text-slate-400 text-sm tracking-wide uppercase font-medium mt-2">
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
                            <PremiumInput
                                id="email"
                                label={t("auth.emailOrPhone")}
                                type="email"
                                icon={Mail}
                                register={register("email")}
                                error={errors.email}
                                placeholder="user@example.com"
                            />

                            <div className="space-y-2">
                                <PremiumInput
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
                                        className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors hover:underline decoration-cyan-400/30 underline-offset-4"
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
                            <Link href="/auth/signup" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                                {t("auth.signUp")}
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </SpotlightCard>
        </div>
    );
}
