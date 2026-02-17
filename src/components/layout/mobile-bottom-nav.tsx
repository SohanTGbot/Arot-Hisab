"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Receipt, Users, Settings, Calculator } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

interface MobileBottomNavProps {
    className?: string;
}

export function MobileBottomNav({ className }: MobileBottomNavProps) {
    const pathname = usePathname();
    const { t } = useI18n();

    const navigation = [
        {
            name: t("nav.dashboard"),
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: t("nav.transactions"),
            href: "/transactions",
            icon: Receipt,
        },
        {
            name: "Calculator", // Hardcoded fallback or add to i18n if possible
            href: "/calculator",
            icon: Calculator,
        },
        {
            name: t("nav.contacts"),
            href: "/contacts",
            icon: Users,
        },
        {
            name: t("nav.settings"),
            href: "/settings",
            icon: Settings,
        },
    ];

    return (
        <div className={cn(
            "w-full h-16 bg-background/80 backdrop-blur-lg border-t border-border z-50 safe-area-pb",
            className
        )}>
            <div className="grid h-full grid-cols-5 mx-auto max-w-lg">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "inline-flex flex-col items-center justify-center px-2 hover:bg-muted/50 transition-colors group",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 mb-1 transition-transform group-active:scale-90",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            />
                            <span className="text-[10px] font-medium truncate w-full text-center">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
