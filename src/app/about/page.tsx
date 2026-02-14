import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b glass-card">
                <div className="container flex h-16 items-center justify-between px-4">
                    <Link href="/" className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        Arot Hisab
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/auth/signin" className={cn(buttonVariants({ variant: "ghost" }))}>
                            Sign In
                        </Link>
                        <Link href="/auth/signup" className={cn(buttonVariants({ variant: "default" }))}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="container px-4 py-20">
                <div className="mx-auto max-w-3xl text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        About Arot Hisab
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Simplifying fish wholesale calculations for markets across West Bengal
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="container px-4 pb-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <Card glass>
                        <CardContent className="p-8 md:p-12">
                            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    Arot Hisab was born from observing the challenges faced by fish wholesale market operators (মাছের আড়ত) in West Bengal. We noticed that complex calculations involving weight deductions, commission rates, and multiple pricing methods were prone to errors and time-consuming.
                                </p>
                                <p>
                                    Our mission is simple: eliminate calculation errors and save time for market operators so they can focus on their business, not arithmetic.
                                </p>
                                <p>
                                    Built with modern technology and designed specifically for the unique needs of fish wholesale markets, Arot Hisab brings efficiency and accuracy to an industry that deserves better tools.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Values */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card glass>
                            <CardContent className="p-6 text-center space-y-4">
                                <Target className="h-12 w-12 text-primary mx-auto" />
                                <h3 className="text-xl font-bold">Our Mission</h3>
                                <p className="text-muted-foreground">
                                    Empower fish market operators with tools that eliminate errors and save time
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardContent className="p-6 text-center space-y-4">
                                <Heart className="h-12 w-12 text-primary mx-auto" />
                                <h3 className="text-xl font-bold">Our Values</h3>
                                <p className="text-muted-foreground">
                                    Simplicity, accuracy, and user-first design in everything we build
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardContent className="p-6 text-center space-y-4">
                                <Users2 className="h-12 w-12 text-primary mx-auto" />
                                <h3 className="text-xl font-bold">Our Community</h3>
                                <p className="text-muted-foreground">
                                    Supporting fish market operators across West Bengal and beyond
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA */}
                    <Card className="glass-card border-primary/50">
                        <CardContent className="p-8 md:p-12 text-center space-y-6">
                            <h2 className="text-3xl font-bold">
                                Join Our Community
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Experience the difference Arot Hisab can make for your business
                            </p>
                            <Link href="/auth/signup" className={cn(buttonVariants({ size: "lg" }))}>
                                Get Started Free
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
