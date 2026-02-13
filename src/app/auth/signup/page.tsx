"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import zxcvbn from "zxcvbn";
import { signUpWithEmail } from "@/lib/actions/auth";
import { useI18n } from "@/lib/i18n/provider";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Check, X, ArrowRight, Sparkles, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const { t } = useI18n();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    // Calculate password strength
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const pwd = e.target.value;
        if (pwd) {
            const result = zxcvbn(pwd);
            setPasswordStrength(result.score);
        } else {
            setPasswordStrength(0);
        }
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return "bg-red-500";
            case 2:
                return "bg-orange-500";
            case 3:
                return "bg-yellow-500";
            case 4:
                return "bg-green-500";
            default:
                return "bg-gray-300";
        }
    };

    const getStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return "Weak";
            case 2:
                return "Fair";
            case 3:
                return "Good";
            case 4:
                return "Strong";
            default:
                return "";
        }
    };

    const passwordRequirements = [
        { label: "At least 8 characters", met: password?.length >= 8 },
        { label: "Contains uppercase", met: /[A-Z]/.test(password || "") },
        { label: "Contains lowercase", met: /[a-z]/.test(password || "") },
        { label: "Contains number", met: /[0-9]/.test(password || "") },
    ];

    const allRequirementsMet = passwordRequirements.every(req => req.met);

    const onSubmit = async (data: SignUpFormData) => {
        setLoading(true);
        try {
            const result = await signUpWithEmail({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(result.message || "Account created successfully!");
            router.push("/auth/verify-email");
        } catch (error: any) {
            toast.error(error.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 md:p-6 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
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
                    className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        style={{
                            left: `${15 + i * 12}%`,
                            top: `${5 + i * 11}%`,
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
                            <UserPlus className="w-10 h-10 text-primary-foreground relative z-10" />
                        </motion.div>

                        <div className="space-y-2">
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
                                {t("auth.createAccount")}
                            </CardTitle>
                            <CardDescription className="text-base text-muted-foreground">
                                {t("auth.signUp")} <Sparkles className="w-4 h-4 inline text-primary" />
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 px-6 md:px-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Full Name Input */}
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="fullName" className="text-sm font-semibold text-foreground">
                                    {t("auth.fullName")}
                                </Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        className="pl-11 h-13 transition-all duration-300 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                        {...register("fullName")}
                                        error={errors.fullName?.message}
                                    />
                                </div>
                            </motion.div>

                            {/* Email Input */}
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
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
                                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
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
                                        onChange={handlePasswordChange}
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
                                                    initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                                                >
                                                    <EyeOff className="w-5 h-5" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="show"
                                                    initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </div>

                                {/* Password Strength Meter */}
                                <AnimatePresence>
                                    {password && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-3 pt-2"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex gap-1.5">
                                                    {[...Array(4)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ scaleX: 0 }}
                                                            animate={{ scaleX: 1 }}
                                                            transition={{ delay: i * 0.1, type: "spring" }}
                                                            className={cn(
                                                                "h-2 flex-1 rounded-full transition-all duration-500",
                                                                i < passwordStrength ? getStrengthColor() : "bg-muted"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-semibold text-muted-foreground">
                                                        Password strength:{" "}
                                                        <span className={cn(
                                                            "font-bold",
                                                            passwordStrength >= 3 ? "text-green-600" :
                                                                passwordStrength >= 2 ? "text-orange-600" : "text-red-600"
                                                        )}>
                                                            {getStrengthText()}
                                                        </span>
                                                    </p>
                                                    {allRequirementsMet && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="flex items-center gap-1 text-green-600"
                                                        >
                                                            <Shield className="w-3 h-3" />
                                                            <span className="text-xs font-semibold">Secure</span>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Password Requirements */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {passwordRequirements.map((req, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.6 + index * 0.05 }}
                                                        className={cn(
                                                            "flex items-center gap-2 text-xs px-2 py-1.5 rounded-md transition-all duration-300",
                                                            req.met ? "bg-green-50 dark:bg-green-950/20" : "bg-muted/50"
                                                        )}
                                                    >
                                                        <motion.div
                                                            animate={{
                                                                scale: req.met ? [1, 1.2, 1] : 1,
                                                            }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            {req.met ? (
                                                                <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                                                            ) : (
                                                                <X className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                                            )}
                                                        </motion.div>
                                                        <span className={cn(
                                                            "font-medium leading-tight",
                                                            req.met ? "text-green-700 dark:text-green-400" : "text-muted-foreground"
                                                        )}>
                                                            {req.label}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Confirm Password Input */}
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                                    {t("auth.confirmPassword")}
                                </Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-11 pr-11 h-13 transition-all duration-300 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                        {...register("confirmPassword")}
                                        error={errors.confirmPassword?.message}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
                                    >
                                        <AnimatePresence mode="wait">
                                            {showConfirmPassword ? (
                                                <motion.div
                                                    key="hide"
                                                    initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                                                >
                                                    <EyeOff className="w-5 h-5" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="show"
                                                    initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Sign Up Button */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
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
                                        {loading ? t("common.loading") : t("auth.createAccount")}
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
                            transition={{ delay: 0.8 }}
                            className="text-center text-sm text-muted-foreground"
                        >
                            {t("auth.haveAccount")}{" "}
                            <Link
                                href="/auth/signin"
                                className="text-primary hover:text-primary/80 font-semibold transition-colors inline-flex items-center gap-1 group"
                            >
                                {t("auth.signIn")}
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
                    Secure signup • End-to-end encrypted 🔒
                </motion.p>
            </motion.div>
        </div>
    );
}
