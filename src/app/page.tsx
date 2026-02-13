"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Users, Zap, Shield, Globe, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}+</span>;
}

export default function LandingPage() {
  const features = [
    {
      icon: Calculator,
      title: "Automated Calculations",
      description: "Complex multi-step calculations done instantly with zero errors",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      title: "Real-time Results",
      description: "See calculations update live as you enter transaction details",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Contact Management",
      description: "Save and quickly access your frequent buyers and sellers",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed in high-pressure market environments",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with industry standards",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Globe,
      title: "Bilingual Support",
      description: "Full support for Bengali and English languages",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="font-bold text-xl text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Arot Hisab
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="font-semibold">
              <Link href="/auth/signin">
                Sign In
              </Link>
            </Button>
            <Button asChild size="default" className="font-semibold">
              <Link href="/auth/signup">
                Get Started
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Simplified */}
      <section className="container px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              <Sparkles className="h-4 w-4" />
              Trusted by fish market operators
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Fish Wholesale Market
              <span className="block text-primary mt-2">
                Calculator Made Simple
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Eliminate calculation errors and save time with our specialized platform designed for fish wholesale markets (মাছের আড়ত) in West Bengal.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button size="lg" asChild className="h-12 px-8 text-base font-semibold">
              <Link href="/auth/signup">
                Start Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base font-semibold">
              <Link href="/features">
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 rounded-lg bg-muted/50">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              <AnimatedCounter value={1000} />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">Active Users</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-muted/50">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              <AnimatedCounter value={50000} />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">Transactions</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-muted/50">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              <AnimatedCounter value={99} duration={1500} />%
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">Accuracy</div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-16 md:py-24">
        <FeatureSection features={features} />
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 md:py-24">
        <CTASection />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function FeatureSection({ features }: { features: any[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed for fish market operators
          </p>
        </motion.div>
      </div>

      <div
        ref={ref}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card">
              <CardHeader>
                <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 w-fit`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground text-xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function CTASection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Simplify Your Calculations?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join fish market operators who trust Arot Hisab for their daily transactions
          </p>
          <div className="pt-4">
            <Button size="lg" asChild className="h-12 px-8 text-base font-semibold">
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Arot Hisab
            </h3>
            <p className="text-sm text-muted-foreground">
              Specialized calculator for fish wholesale markets
            </p>
          </div>

          {[
            { title: "Product", links: [{ label: "Features", href: "/features" }, { label: "About", href: "/about" }] },
            { title: "Support", links: [{ label: "Contact", href: "/contact" }, { label: "Feedback", href: "/feedback" }] },
            { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Arot Hisab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
