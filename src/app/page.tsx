"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Calculator, TrendingUp, Users, Zap, Shield, Globe, ArrowRight, Sparkles, ChevronRight, Menu, X } from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import UnderwaterBackground from "@/components/Hero/UnderwaterBackground";
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 border-b",
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-white/10 py-3 shadow-lg shadow-cyan-900/10"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between px-6">
        <Link href="/" className="font-bold text-2xl text-white flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Arot Hisab"
            width={0}
            height={0}
            sizes="100vw"
            className="w-auto h-10 object-contain hover:scale-105 transition-transform duration-300"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors relative group"
            >
              {item}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/signin" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Button asChild size="default" className="rounded-full font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cyan-500 hover:bg-cyan-400 text-white border-none hover:scale-105 transition-all duration-300">
            <Link href="/auth/signup">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, borderBottomWidth: 0 }}
            animate={{ opacity: 1, height: "auto", borderBottomWidth: "1px" }}
            exit={{ opacity: 0, height: 0, borderBottomWidth: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <nav className="flex flex-col gap-2">
                {[
                  { name: "Features", icon: Zap, href: "/features" },
                  { name: "How it Works", icon: Calculator, href: "/how-it-works" },
                  { name: "Pricing", icon: TrendingUp, href: "/pricing" }
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5 text-cyan-500/70" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="h-px bg-white/10 my-1" />

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className="w-5 h-5 text-cyan-500/70" />
                    Sign In
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="p-1"
                >
                  <Button asChild className="w-full h-10 text-sm font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                    <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const features = [
    {
      icon: Calculator,
      title: "Automated Calculations",
      description: "Complex multi-step calculations done instantly with zero errors",
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20",
    },
    {
      icon: TrendingUp,
      title: "Real-time Results",
      description: "See calculations update live as you enter transaction details",
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/20",
    },
    {
      icon: Users,
      title: "Contact Management",
      description: "Save and quickly access your frequent buyers and sellers",
      color: "from-orange-500 to-red-500",
      shadow: "shadow-orange-500/20",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed in high-pressure market environments",
      color: "from-yellow-500 to-orange-500",
      shadow: "shadow-yellow-500/20",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with industry standards",
      color: "from-green-500 to-emerald-500",
      shadow: "shadow-green-500/20",
    },
    {
      icon: Globe,
      title: "Bilingual Support",
      description: "Full support for Bengali and English languages",
      color: "from-indigo-500 to-blue-500",
      shadow: "shadow-indigo-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-cyan-500/30 font-sans">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      <Navbar />

      {/* Hero Section with Fish Animation */}
      <section className="relative w-full h-[110vh] overflow-hidden flex items-center justify-center">
        {/* Background Animation */}
        <UnderwaterBackground />

        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950" />

        <div className="container relative z-20 px-4 pt-20 text-center space-y-8">
          {/* Animated Light Beams */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 blur-3xl animate-pulse-slow"></div>
            <div className="absolute top-[-50%] right-[-20%] w-[50%] h-[200%] bg-gradient-to-l from-transparent via-cyan-500/5 to-transparent -rotate-12 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-950/40 text-cyan-300 text-xs font-semibold border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_25px_rgba(34,211,238,0.15)] mb-8 hover:bg-cyan-950/60 transition-colors cursor-pointer group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Trusted by 100+ fish market operators
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>

          {/* Main Heading with Text Reveal */}
          <div className="space-y-6 max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white leading-[0.9] drop-shadow-2xl">
              <span className="block opacity-90">Experience the</span>
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent pb-4">
                  Depth of Efficiency
                </span>
              </span>
            </h1>
            {/* Subtext Reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mt-6 px-4">
                The ultimate calculation engine for fish wholesale markets. <br className="hidden md:block" /> Fast, accurate, and designed for high-volume transactions.
              </p>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-12 relative z-30"
          >
            <Button size="lg" asChild className="h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl font-bold rounded-full shadow-[0_0_50px_rgba(6,182,212,0.4)] bg-white text-cyan-950 hover:bg-cyan-50 hover:scale-105 transition-all duration-300 group ring-4 ring-white/10 w-full sm:w-auto">
              <Link href="/auth/signup">
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl font-medium rounded-full text-white hover:bg-white/10 hover:text-white border border-white/10 backdrop-blur-md transition-all hover:border-white/20 w-full sm:w-auto">
              <Link href="/features">
                See How It Works
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-32 relative z-10 -mt-20">
        <FeatureSection features={features} />
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20 relative z-10 mb-20">
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
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Everything You Need <span className="text-cyan-500">.</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light">
            Powerful features designed specifically for the unique needs of fish market operators
          </p>
        </motion.div>
      </div>

      <div
        ref={ref}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto perspective-1000"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <SpotlightCard className="h-full p-6 md:p-10 border-white/5 bg-slate-900/40 backdrop-blur-sm">
              <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-8 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                {feature.description}
              </p>
            </SpotlightCard>
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
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[3rem] rotate-1 opacity-20 blur-3xl transform scale-105" />
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/10 max-w-5xl mx-auto shadow-2xl">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.4),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-cyan-950/50 to-transparent" />
        </div>

        <div className="relative z-10 p-8 md:p-32 text-center space-y-8 md:space-y-12">
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">
            Ready to <span className="text-cyan-400">Simplify?</span>
          </h2>
          <p className="text-slate-300 text-lg md:text-2xl max-w-2xl mx-auto font-light">
            Join fish market operators who trust Arot Hisab for their daily transactions.
          </p>
          <div className="pt-4 md:pt-8">
            <Button size="lg" asChild className="h-16 md:h-20 px-10 md:px-16 text-xl md:text-2xl font-bold rounded-full shadow-[0_0_40px_rgba(6,182,212,0.5)] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all hover:scale-105 ring-8 ring-cyan-900/20 w-full sm:w-auto">
              <Link href="/auth/signup">
                Get Started Free
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
    <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-2xl">
      <div className="container px-6 py-20">
        <div className="grid gap-16 md:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="block relative h-16 w-48 mb-4">
              <Image
                src="/logo.png"
                alt="Arot Hisab"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-base text-slate-400 leading-relaxed max-w-xs">
              Specialized calculator and management system designed for the specific needs of fish wholesale markets.
            </p>
          </div>

          {[
            { title: "Product", links: [{ label: "Features", href: "/features" }, { label: "Pricing", href: "/pricing" }, { label: "Changelog", href: "/changelog" }] },
            { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Careers", href: "/careers" }] },
            { title: "Legal", links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-white mb-8 text-lg tracking-wide">{section.title}</h4>
              <ul className="space-y-4 text-base">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-cyan-400 transition-colors block hover:translate-x-1 duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; 2026 Arot Hisab. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
