"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { ArrowLeft, Search, Book, MessageCircle, FileText, Settings, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HelpPage() {
    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>

            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-bold tracking-tight">How can we help?</h1>
                <div className="max-w-xl mx-auto relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for help..."
                        className="pl-10 h-12 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardHeader>
                        <Book className="h-8 w-8 text-blue-500 mb-2" />
                        <CardTitle>Getting Started</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Learn the basics of setting up your account and making your first transaction.
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardHeader>
                        <FileText className="h-8 w-8 text-green-500 mb-2" />
                        <CardTitle>Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Understanding calculations, managing records, and generating reports.
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardHeader>
                        <Settings className="h-8 w-8 text-orange-500 mb-2" />
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Manage your profile, preferences, security, and notifications.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How is the net weight calculated?</AccordionTrigger>
                        <AccordionContent>
                            We offer two calculation methods:
                            <ul className="list-disc pl-4 mt-2 space-y-1">
                                <li><strong>Method A:</strong> Net Weight = Gross Weight × 0.95 (5% deduction)</li>
                                <li><strong>Method B:</strong> Net Weight = (Kg × 0.95) + Grams (Only Kg carries deduction)</li>
                            </ul>
                            You can change your preferred method in Settings.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is my data secure?</AccordionTrigger>
                        <AccordionContent>
                            Yes, your data is encrypted and stored securely using Supabase (PostgreSQL). We implement strict Row Level Security (RLS) policies so only you can access your data. Daily backups are performed automatically.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can I use the app offline?</AccordionTrigger>
                        <AccordionContent>
                            Yes! Arot Hisab is a Progressive Web App (PWA). You can install it on your device and access basic features offline. Data will automatically sync when you come back online.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                        <AccordionContent>
                            Go to the Sign In page and click "Forgot Password?". Enter your email address, and we'll send you a link to create a new password.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>How can I export my data?</AccordionTrigger>
                        <AccordionContent>
                            Navigate to the Dashboard or Transactions page. You'll find an "Export" button that allows you to download your data in PDF or Excel format.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
                <h2 className="text-2xl font-bold">Still need help?</h2>
                <p className="text-muted-foreground">
                    Our support team is available 24/7 to assist you with any issues.
                </p>
                <div className="flex justify-center gap-4 pt-2">
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
