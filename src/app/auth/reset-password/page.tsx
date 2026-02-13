"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/actions/auth";
import zxcvbn from "zxcvbn";

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const password = watch("password");

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

    const onSubmit = async (data: ResetPasswordFormData) => {
        setLoading(true);
        try {
            const result = await resetPassword(data.password);

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(result.message || "Password updated successfully!");
            router.push("/auth/signin");
        } catch (error: any) {
            toast.error(error.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Card className="w-full max-w-md glass-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                onChange={handlePasswordChange}
                                error={errors.password?.message}
                            />
                            {password && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded ${i < passwordStrength ? getStrengthColor() : "bg-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Password strength: {getStrengthText()}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                error={errors.confirmPassword?.message}
                            />
                        </div>
                        <Button type="submit" className="w-full" loading={loading}>
                            Reset Password
                        </Button>
                    </form>

                    <div className="text-center">
                        <Link
                            href="/auth/signin"
                            className="text-sm text-primary hover:underline"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
