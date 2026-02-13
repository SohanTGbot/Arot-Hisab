"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { resendVerificationEmail } from "@/lib/actions/auth";
import { Mail, CheckCircle2 } from "lucide-react";

export default function VerifyEmailPage() {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    // If user is already verified, redirect to dashboard
    useEffect(() => {
        if (user?.email_confirmed_at) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleResendEmail = async () => {
        setLoading(true);
        try {
            const result = await resendVerificationEmail();

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(result.message || "Verification email sent!");
        } catch (error: any) {
            toast.error(error.message || "Failed to resend email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Card className="w-full max-w-md glass-card">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Mail className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        Verify Your Email
                    </CardTitle>
                    <CardDescription className="text-center">
                        We've sent a verification link to your email address
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            Please check your email inbox (and spam folder) for a verification link.
                        </p>
                        {user?.email && (
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                {user.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>Click the verification link in your email</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>You'll be automatically redirected to your dashboard</span>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <p className="text-sm text-center text-muted-foreground">
                            Didn't receive the email?
                        </p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleResendEmail}
                            loading={loading}
                        >
                            Resend Verification Email
                        </Button>
                    </div>

                    <div className="pt-4 flex justify-center gap-4 text-sm">
                        <Link
                            href="/auth/signin"
                            className="text-primary hover:underline"
                        >
                            Back to Sign In
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <button
                            onClick={() => {
                                // Sign out handled by useAuth
                                router.push("/auth/signin");
                            }}
                            className="text-primary hover:underline"
                        >
                            Use Different Account
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
