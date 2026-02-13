"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";

export function MobileBottomNav() {
    const pathname = usePathname();
    const { t } = useI18n();

    const navItems = [
        {
            name: t("nav.dashboard"),
            href: "/dashboard",
            icon: Home,
        },
        {
            name: t("nav.transactions"),
            href: "/transactions",
            icon: Receipt,
        },
        {
            name: t("nav.contacts"),
            href: "/contacts",
            icon: Users,
        },
        {
            name: t("nav.profile"),
            href: "/profile",
            icon: User,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] md:hidden">
            <div className="flex items-center justify-around h-[72px] px-4 safe-area-inset-bottom">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-200",
                                "touch-target min-w-[64px]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground active:scale-95"
                            )}
                        >
                            {/* Pill Background for Active State */}
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-pill"
                                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="relative z-10"
                            >
                                <Icon
                                    className="h-6 w-6"
                                    strokeWidth={isActive ? 2.5 : 2}
                                    fill={isActive ? "currentColor" : "none"}
                                />
                            </motion.div>

                            {/* Label */}
                            <span className={cn(
                                "text-[11px] font-medium relative z-10 leading-none",
                                isActive && "font-semibold"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
