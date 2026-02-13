"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Menu, LogOut, Settings as SettingsIcon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n/provider";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { SoundToggle } from "@/components/sound-toggle";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { signOut } = useAuth();
    const router = useRouter();
    const { language, setLanguage } = useI18n();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "bn" : "en");
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                {/* Left: Menu + Logo */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={onMenuClick}
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                        <Home className="h-5 w-5 md:h-6 md:w-6" />
                        <span className="hidden sm:inline">Arot Hisab</span>
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Language toggle - hidden on mobile, shown on desktop */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLanguage}
                        className="hidden md:flex"
                        aria-label={`Switch to ${language === "en" ? "Bengali" : "English"}`}
                    >
                        <Globe className="h-5 w-5" />
                    </Button>

                    {/* Theme Switcher */}
                    <div className="hidden md:block">
                        <ThemeSwitcher />
                    </div>

                    {/* Sound Toggle */}
                    <SoundToggle className="hidden md:flex" />

                    {/* Settings - mobile only */}
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="md:hidden"
                    >
                        <Link href="/settings" aria-label="Settings">
                            <SettingsIcon className="h-5 w-5" />
                        </Link>
                    </Button>

                    {/* Sign out */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSignOut}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label="Sign out"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
