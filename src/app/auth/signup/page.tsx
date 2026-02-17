"use client";
// Force rebuild

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

            // Auto-login success handling
            // Assuming successful signup returns a session or we can redirect
            toast.success("Account created successfully!");
            router.push("/dashboard");
            router.refresh();

        } catch (error: any) {
            toast.error(error.message || "Failed to create account");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative z-10 px-4 sm:px-0">
            <SpotlightCard className="p-6 md:p-8 border-white/5 bg-slate-900/40 backdrop-blur-md shadow-2xl">
                <div className="space-y-6">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full" />
                                <Image
                                    src="/logo.png"
                                    alt="Arot Hisab"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-auto h-16 object-contain relative"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                {t("auth.getStarted")}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {t("auth.subheader")}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                        <div className="space-y-3">
                            <PremiumInput
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
                                <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-500",
                                            strength <= 25 ? "bg-red-500" :
                                                strength <= 50 ? "bg-orange-500" :
                                                    strength <= 75 ? "bg-yellow-500" : "bg-cyan-500"
                                        )}
                                        style={{ width: `${strength}%` }}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {requirements.map((req, i) => (
                                        <div key={i} className="flex items-center gap-1 text-[10px]">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                req.re.test(password || "") ? "bg-cyan-500" : "bg-slate-700"
                                            )} />
                                            <span className={cn(
                                                "transition-colors duration-300",
                                                req.re.test(password || "") ? "text-cyan-400" : "text-slate-500"
                                            )}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading || !isValid}
                                className={cn(
                                    "w-full h-12 text-base font-semibold transition-all duration-300 rounded-lg",
                                    "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20",
                                    loading && "opacity-80 cursor-not-allowed"
                                )}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    t("auth.createAccountBtn")
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-400">
                            {t("auth.alreadyHaveAccount")}{" "}
                            <Link href="/auth/signin" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                                {t("auth.signIn")}
                            </Link>
                        </p>
                    </div>
                </div>
            </SpotlightCard>
        </div>
    );
}
