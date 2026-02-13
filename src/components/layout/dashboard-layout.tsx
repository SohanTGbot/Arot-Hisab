"use client";

import { useState, useEffect } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { SplashScreen } from "@/components/splash-screen";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    const [splashComplete, setSplashComplete] = useState(false);

    useEffect(() => {
        // Check if splash has been shown in this session
        const splashShown = sessionStorage.getItem('splashShown');
        if (splashShown) {
            setShowSplash(false);
            setSplashComplete(true);
        }
    }, []);

    const handleSplashComplete = () => {
        sessionStorage.setItem('splashShown', 'true');
        setSplashComplete(true);
    };

    if (showSplash && !splashComplete) {
        return <SplashScreen onComplete={handleSplashComplete} duration={1500} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <Sidebar className="h-full" />
                </div>

                {/* Main Content - Adjusted padding for new bottom nav height */}
                <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
}
