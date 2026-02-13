"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { signInWithEmail } from "@/lib/actions/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { t } = useI18n();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
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

            toast.success("Signed in successfully!");
            router.push("/dashboard");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 md:p-6 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${10 + i * 10}%`,
                        }}
                        animate={{
                            y: [-20, 20, -20],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="glass-card border-border/50 shadow-2xl backdrop-blur-xl overflow-hidden">
                    {/* Gradient overlay at top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary" />

                    <CardHeader className="space-y-4 text-center pb-8 pt-8">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                            }}
                            className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center shadow-lg ring-4 ring-primary/10 relative overflow-hidden"
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{
                                    x: ['-100%', '200%'],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    repeatDelay: 3
                                }}
                            />
                            <LogIn className="w-10 h-10 text-primary-foreground relative z-10" />
                        </motion.div>

                        <div className="space-y-2">
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent animate-gradient">
                                {t("common.welcome")}
                            </CardTitle>
                            <CardDescription className="text-base text-muted-foreground">
                                {t("auth.signIn")} <Sparkles className="w-4 h-4 inline text-primary" />
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 px-6 md:px-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Input */}
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                                    {t("auth.email")}
                                </Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-11 h-13 transition-all duration-300 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                        {...register("email")}
                                        error={errors.email?.message}
                                    />
                                </div>
                            </motion.div>

                            {/* Password Input */}
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                                    {t("auth.password")}
                                </Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-11 pr-11 h-13 transition-all duration-300 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                        {...register("password")}
                                        error={errors.password?.message}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
                                    >
                                        <AnimatePresence mode="wait">
                                            {showPassword ? (
                                                <motion.div
                                                    key="hide"
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.5, opacity: 0 }}
                                                >
                                                    <EyeOff className="w-5 h-5" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="show"
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.5, opacity: 0 }}
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Forgot Password Link */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center justify-end"
                            >
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1 group"
                                >
                                    {t("auth.forgotPassword")}
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </motion.div>

                            {/* Sign In Button */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                                className="pt-2"
                            >
                                <Button
                                    type="submit"
                                    className="w-full h-13 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                                    disabled={loading}
                                    loading={loading}
                                >
                                    {/* Shimmer effect on button */}
                                    {!loading && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                            animate={{
                                                x: ['-100%', '200%'],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "linear",
                                                repeatDelay: 1
                                            }}
                                        />
                                    )}
                                    <span className="relative z-10 inline-flex items-center gap-2">
                                        {loading ? t("common.loading") : t("auth.signIn")}
                                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                    </span>
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pt-6 pb-8 px-6 md:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center text-sm text-muted-foreground"
                        >
                            {t("auth.noAccount")}{" "}
                            <Link
                                href="/auth/signup"
                                className="text-primary hover:text-primary/80 font-semibold transition-colors inline-flex items-center gap-1 group"
                            >
                                {t("auth.signUp")}
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </motion.div>
                    </CardFooter>
                </Card>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center text-xs text-muted-foreground mt-6"
                >
                    Secure authentication • Protected by encryption 🔒
                </motion.p>
            </motion.div>
        </div>
    );
}
