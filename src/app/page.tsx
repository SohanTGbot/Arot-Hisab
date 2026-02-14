"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Users, Zap, Shield, Globe, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import FishAnimation from "@/components/FishAnimation/FishAnimation";

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
      <header className="fixed top-0 z-50 w-full border-b bg-background/0 backdrop-blur-sm transition-all duration-300 hover:bg-background/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="font-bold text-xl text-white flex items-center gap-2 drop-shadow-md">
            <Sparkles className="h-5 w-5 text-primary" />
            Arot Hisab
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="font-semibold text-white hover:text-white hover:bg-white/10">
              <Link href="/auth/signin">
                Sign In
              </Link>
            </Button>
            <Button asChild size="default" className="font-semibold shadow-lg shadow-primary/20">
              <Link href="/auth/signup">
                Get Started
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Fish Animation */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0 bg-black">
          <FishAnimation frameCount={240} />
          {/* Gradient Overlay for text readability and transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
        </div>

        <div className="container relative z-20 px-4 pt-20 text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold border border-white/20 backdrop-blur-md shadow-lg">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Trusted by fish market operators
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
              Experience the
              <span className="block text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mt-2">
                Depth of Efficiency
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light"
          >
            The ultimate calculation engine for fish wholesale markets. Fast, accurate, and designed for high-volume transactions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
          >
            <Button size="lg" asChild className="h-14 px-10 text-lg font-bold rounded-full shadow-xl shadow-cyan-500/20 hover:scale-105 transition-transform duration-300">
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-10 text-lg font-bold rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all">
              <Link href="/features">
                See How It Works
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-20 pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <div className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all">
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
              <AnimatedCounter value={1000} />
            </div>
            <div className="text-base text-muted-foreground font-medium uppercase tracking-wider">Active Users</div>
          </div>
          <div className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all">
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
              <AnimatedCounter value={50000} />
            </div>
            <div className="text-base text-muted-foreground font-medium uppercase tracking-wider">Transactions</div>
          </div>
          <div className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all">
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
              <AnimatedCounter value={99} duration={1500} />%
            </div>
            <div className="text-base text-muted-foreground font-medium uppercase tracking-wider">Accuracy</div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-16 md:py-24 relative z-10">
        <FeatureSection features={features} />
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 md:py-24 relative z-10">
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
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Powerful features designed for fish market operators
          </p>
        </motion.div>
      </div>

      <div
        ref={ref}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 w-fit shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-foreground text-2xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-muted-foreground leading-relaxed">
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
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground max-w-5xl mx-auto shadow-2xl">
        {/* Abstract Background pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 p-12 md:p-20 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Simplify Your Calculations?
          </h2>
          <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto font-medium">
            Join fish market operators who trust Arot Hisab for their daily transactions.
          </p>
          <div className="pt-6">
            <Button size="lg" variant="secondary" asChild className="h-14 px-10 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all">
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
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
