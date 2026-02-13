"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactMessageSchema, type ContactMessageFormData } from "@/lib/validations/forms";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { submitContactForm } from "@/lib/actions/contact";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactMessageFormData>({
        resolver: zodResolver(contactMessageSchema),
    });

    const onSubmit = async (data: ContactMessageFormData) => {
        setLoading(true);
        try {
            const result = await submitContactForm(data);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Message sent! We'll get back to you soon.");
            reset();
        } catch (error: any) {
            toast.error("Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b glass-card">
                <div className="container flex h-16 items-center justify-between px-4">
                    <Link href="/" className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        Arot Hisab
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild>
                            <Link href="/auth/signin">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/auth/signup">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="container px-4 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Have questions? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <Card glass>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Send us a Message
                                    </CardTitle>
                                    <CardDescription>
                                        Fill out the form and we'll get back to you within 24 hours
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                {...register("name")}
                                                error={errors.name?.message}
                                                placeholder="Your name"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...register("email")}
                                                error={errors.email?.message}
                                                placeholder="your.email@example.com"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                {...register("subject")}
                                                error={errors.subject?.message}
                                                placeholder="How can we help?"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="message">Message</Label>
                                            <textarea
                                                id="message"
                                                {...register("message")}
                                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                placeholder="Tell us more about your inquiry..."
                                            />
                                            {errors.message && (
                                                <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                                            )}
                                        </div>

                                        <Button type="submit" className="w-full" loading={loading}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card glass>
                                <CardHeader>
                                    <CardTitle className="text-lg">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-sm text-muted-foreground">support@arothisab.com</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card glass>
                                <CardHeader>
                                    <CardTitle className="text-lg">Response Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        We typically respond to all inquiries within 24 hours during business days.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card glass>
                                <CardHeader>
                                    <CardTitle className="text-lg">Other Ways to Reach Us</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/feedback">Submit Feedback</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/features">View Features</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
