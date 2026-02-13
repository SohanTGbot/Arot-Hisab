import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Calculator,
    TrendingUp,
    Users,
    Zap,
    Shield,
    Globe,
    Download,
    FileText,
    BarChart,
    Clock,
    Lock,
    Smartphone
} from "lucide-react";

export default function FeaturesPage() {
    const features = [
        {
            icon: Calculator,
            title: "Automated Calculations",
            description: "Complex multi-step calculations with Method A and Method B support. Handles gross weight, deductions, net weight, rates, and commission automatically.",
            benefits: ["Zero calculation errors", "Instant results", "Multiple calculation methods"]
        },
        {
            icon: TrendingUp,
            title: "Real-time Updates",
            description: "See calculations update live as you enter data. No need to click calculate - results appear instantly.",
            benefits: ["Live calculation preview", "Immediate feedback", "Faster workflow"]
        },
        {
            icon: Users,
            title: "Contact Management",
            description: "Save buyer and seller information for quick access. Never type the same name twice.",
            benefits: ["Quick contact selection", "Phone numbers stored", "Notes and tags"]
        },
        {
            icon: FileText,
            title: "Transaction History",
            description: "Complete record of all transactions with search and filter capabilities.",
            benefits: ["Searchable history", "Date range filters", "Export to PDF/Excel"]
        },
        {
            icon: BarChart,
            title: "Analytics & Reports",
            description: "Track revenue, transaction volume, and business trends over time.",
            benefits: ["Revenue tracking", "Monthly summaries", "Visual charts"]
        },
        {
            icon: Download,
            title: "Export & Print",
            description: "Generate professional receipts and export data in multiple formats.",
            benefits: ["PDF receipts", "Excel exports", "Print-ready formats"]
        },
        {
            icon: Globe,
            title: "Bilingual Interface",
            description: "Full support for Bengali and English languages. Switch anytime.",
            benefits: ["Bengali & English", "Instant switching", "Localized content"]
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your data is encrypted and protected. We never share your information.",
            benefits: ["End-to-end encryption", "Secure authentication", "Privacy focused"]
        },
        {
            icon: Smartphone,
            title: "Mobile Optimized",
            description: "Works perfectly on phones, tablets, and desktops. Access anywhere.",
            benefits: ["Responsive design", "Touch optimized", "Works offline"]
        },
        {
            icon: Clock,
            title: "24/7 Availability",
            description: "Access your data anytime, anywhere. No downtime.",
            benefits: ["Always available", "Cloud synced", "Automatic backups"]
        },
        {
            icon: Lock,
            title: "Role-based Access",
            description: "Control who can view and edit data with user roles and permissions.",
            benefits: ["User roles", "Access control", "Audit logs"]
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Optimized for speed in high-pressure market environments.",
            benefits: ["Sub-second response", "Optimized code", "Fast loading"]
        },
    ];

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

            {/* Hero */}
            <section className="container px-4 py-20">
                <div className="mx-auto max-w-3xl text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Powerful Features for Fish Markets
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Everything you need to manage your wholesale fish business efficiently
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container px-4 pb-20">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <Card key={index} glass>
                            <CardHeader>
                                <feature.icon className="h-10 w-10 text-primary mb-3" />
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                                <CardDescription className="text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i} className="text-sm flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container px-4 pb-20">
                <Card className="max-w-4xl mx-auto glass-card border-primary/50">
                    <CardContent className="p-8 md:p-12 text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready to Get Started?
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Join today and experience the difference
                        </p>
                        <Button size="lg" asChild>
                            <Link href="/auth/signup">
                                Start Free Trial
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
