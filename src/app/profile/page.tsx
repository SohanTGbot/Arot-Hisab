"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/validations/forms";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { updateUserProfile } from "@/lib/actions/user";
import { User, Mail, Phone, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { language } = useI18n();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.user_metadata?.full_name || "",
            phone: user?.user_metadata?.phone || "",
            preferredLanguage: (user?.user_metadata?.language_preference || "en") as "en" | "bn",
            preferredDeductionMethod: (user?.user_metadata?.deduction_method || "A") as "A" | "B",
            theme: (user?.user_metadata?.theme_preference || "system") as "light" | "dark" | "system",
        } as ProfileFormData,
    });

    const onSubmit = async (data: ProfileFormData) => {
        setLoading(true);
        try {
            const result = await updateUserProfile({
                full_name: data.fullName,
                phone: data.phone,
                language_preference: data.preferredLanguage,
                deduction_method: data.preferredDeductionMethod,
                theme_preference: data.theme,
            });

            if (result.success) {
                toast.success("Profile updated successfully!");
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your account information and preferences
                    </p>
                </motion.div>

                {/* Profile Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-8 w-8 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>{user?.user_metadata?.full_name || user?.email}</CardTitle>
                                        <Badge variant="secondary">Active</Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <Mail className="h-3 w-3" />
                                        {user?.email}
                                    </CardDescription>
                                    {user?.created_at && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Member since {formatDistanceToNow(new Date(user.created_at), language)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* Profile Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your account details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            {...register("fullName")}
                                            placeholder="Your full name"
                                        />
                                        {errors.fullName && (
                                            <p className="text-sm text-destructive">{errors.fullName.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                {...register("phone")}
                                                placeholder="+880 1234 567890"
                                                className="pl-10"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="preferredLanguage">Preferred Language</Label>
                                        <select
                                            id="preferredLanguage"
                                            {...register("preferredLanguage")}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="en">English</option>
                                            <option value="bn">বাংলা (Bengali)</option>
                                        </select>
                                        {errors.preferredLanguage && (
                                            <p className="text-sm text-destructive">{errors.preferredLanguage.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="preferredDeductionMethod">Default Calculation Method</Label>
                                        <select
                                            id="preferredDeductionMethod"
                                            {...register("preferredDeductionMethod")}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="A">Method A (Gross × 0.95)</option>
                                            <option value="B">Method B ((Kg × 0.95) + Grams)</option>
                                        </select>
                                        {errors.preferredDeductionMethod && (
                                            <p className="text-sm text-destructive">
                                                {errors.preferredDeductionMethod.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="theme">Theme Preference</Label>
                                    <select
                                        id="theme"
                                        {...register("theme")}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="system">System</option>
                                    </select>
                                    {errors.theme && (
                                        <p className="text-sm text-destructive">{errors.theme.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={loading} size="lg">
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
