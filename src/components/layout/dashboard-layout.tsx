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
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header - Fixed height, standard flex item */}
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Layout Area - Takes remaining space */}
            <div className="flex flex-1 overflow-hidden relative">
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
                        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 h-full",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <Sidebar className="h-full" />
                </div>

                {/* Main Content - Scrollable Area */}
                <main className="flex-1 overflow-y-auto w-full p-2 md:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl min-h-full">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation - Pushed to bottom by flex layout, no overlap possible */}
            <MobileBottomNav className="flex-none md:hidden" />
        </div>
    );
}
