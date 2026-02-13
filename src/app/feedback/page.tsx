"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema, type FeedbackFormData } from "@/lib/validations/forms";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Bug, Lightbulb, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/provider";

import { submitFeedback } from "@/lib/actions/feedback";

export default function FeedbackPage() {
    const [loading, setLoading] = useState(false);
    const { t } = useI18n();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FeedbackFormData>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            type: "general" as const,
            priority: "medium" as const,
            subject: "",
            description: "",
        },
    });

    const onSubmit = async (data: FeedbackFormData) => {
        setLoading(true);
        try {
            const result = await submitFeedback(data);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Feedback submitted! Thank you for helping us improve.");
            reset();
        } catch (error: any) {
            toast.error("Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Feedback & Support</h1>
                    <p className="text-muted-foreground">
                        Help us improve by sharing your thoughts
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 max-w-5xl">
                    <Card glass className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Submit Feedback</CardTitle>
                            <CardDescription>
                                Report bugs, request features, or share general feedback
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="type">Feedback Type</Label>
                                    <select
                                        id="type"
                                        {...register("type")}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="bug">🐛 Bug Report</option>
                                        <option value="feature">💡 Feature Request</option>
                                        <option value="general">💬 General Feedback</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="priority">Priority</Label>
                                    <select
                                        id="priority"
                                        {...register("priority")}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        {...register("subject")}
                                        error={errors.subject?.message}
                                        placeholder="Brief description of your feedback"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        {...register("description")}
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="Please provide as much detail as possible..."
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" loading={loading}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Submit Feedback
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Card glass>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Tips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex gap-2">
                                    <Bug className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Bug Reports</p>
                                        <p className="text-muted-foreground text-xs">Include steps to reproduce</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Feature Requests</p>
                                        <p className="text-muted-foreground text-xs">Explain the use case</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <MessageCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium">General Feedback</p>
                                        <p className="text-muted-foreground text-xs">Share your experience</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <CardTitle className="text-lg">Response Time</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <p>We typically respond to feedback within 2-3 business days.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
