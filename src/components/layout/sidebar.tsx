"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Receipt,
    Users,
    Settings,
    Heart,
    MessageSquare,
    Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n/provider";
import { SidebarQuickSettings } from "./sidebar-quick-settings";

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();
    const { t } = useI18n();
    const isAdmin = user?.user_metadata?.role === "admin";

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
            name: t("nav.contacts"),
            href: "/contacts",
            icon: Users,
        },
        {
            name: t("nav.donate"),
            href: "/donate",
            icon: Heart,
        },
        {
            name: t("nav.feedback"),
            href: "/feedback",
            icon: MessageSquare,
        },
        {
            name: t("nav.settings"),
            href: "/settings",
            icon: Settings,
        },
    ];

    const adminNavigation = [
        {
            name: t("nav.admin"),
            href: "/admin",
            icon: Shield,
        },
    ];

    const allNavigation = isAdmin
        ? [...navigation, ...adminNavigation]
        : navigation;

    return (
        <aside
            className={cn(
                "flex flex-col gap-2 border-r glass-card h-full overflow-y-auto",
                className
            )}
        >
            <nav className="flex flex-col gap-1 p-4">
                {allNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-semibold transition-all hover:bg-accent touch-target",
                                isActive
                                    ? "bg-accent text-accent-foreground"
                                    : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                            )}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span className="leading-none">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Quick Settings Panel */}
            <div className="mt-auto">
                <SidebarQuickSettings />
            </div>

            {/* Spacer for bottom padding */}
            <div className="flex-1" />
        </aside>
    );
}
