"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "@/lib/actions/auth";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        try {
            const result = await sendPasswordResetEmail(data.email);

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(result.message || "Password reset email sent!");
            setEmailSent(true);
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Card className="w-full max-w-md glass-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {emailSent ? "Check Your Email" : "Forgot Password?"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {emailSent
                            ? `We've sent a password reset link to ${getValues("email")}`
                            : "Enter your email address and we'll send you a link to reset your password"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!emailSent ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email")}
                                    error={errors.email?.message}
                                />
                            </div>
                            <Button type="submit" className="w-full" loading={loading}>
                                Send Reset Link
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    Please check your email inbox and spam folder for the reset link.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setEmailSent(false);
                                    setLoading(false);
                                }}
                            >
                                Try Another Email
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Link
                        href="/auth/signin"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
