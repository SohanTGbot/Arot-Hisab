"use client";

import * as React from "react";
import { Volume2, VolumeX, Globe, Palette, Moon, Sun, Hash } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import { useI18n } from "@/lib/i18n/provider";
import { useTheme } from "@/lib/theme/theme-provider";
import { themes } from "@/lib/theme/themes";
import { cn } from "@/lib/utils";
import type { ThemeColor } from "@/lib/theme/types";

export function MobileSettingsPanel() {
    const { enabled: soundEnabled, toggle: toggleSound, play } = useSound();
    const { language, setLanguage, useBengaliNumerals, toggleNumerals } = useI18n();
    const { theme, setThemeColor, toggleMode } = useTheme();

    const handleSoundToggle = () => {
        if (!soundEnabled) {
            play('toggle');
        }
        toggleSound();
    };

    const handleLanguageToggle = () => {
        play('tap');
        setLanguage(language === "en" ? "bn" : "en");
    };

    const handleModeToggle = () => {
        play('toggle');
        toggleMode();
    };

    const handleNumeralsToggle = () => {
        play('toggle');
        toggleNumerals();
    };

    const handleThemeChange = (color: ThemeColor) => {
        play('select');
        setThemeColor(color);
    };

    const currentTheme = themes.find((t) => t.color === theme.color) || themes[0];
    const isDark = theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className="px-4 py-3 space-y-4">
            {/* Section Title */}
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Quick Settings
            </h3>

            {/* Control Buttons Grid - Now 2x3 */}
            <div className="grid grid-cols-2 gap-3">
                {/* Sound Toggle */}
                <ControlButton
                    onClick={handleSoundToggle}
                    icon={soundEnabled ? Volume2 : VolumeX}
                    label="Sound"
                    active={soundEnabled}
                    activeColor="from-blue-500 to-blue-600"
                />

                {/* Language Toggle */}
                <ControlButton
                    onClick={handleLanguageToggle}
                    icon={Globe}
                    label={language === "en" ? "English" : "বাংলা"}
                    active={true}
                    activeColor="from-green-500 to-green-600"
                />

                {/* Dark Mode Toggle */}
                <ControlButton
                    onClick={handleModeToggle}
                    icon={isDark ? Moon : Sun}
                    label={isDark ? "Dark" : "Light"}
                    active={isDark}
                    activeColor="from-purple-500 to-purple-600"
                />

                {/* Bengali Numerals Toggle */}
                <ControlButton
                    onClick={handleNumeralsToggle}
                    icon={Hash}
                    label={useBengaliNumerals ? "১২৩" : "123"}
                    active={useBengaliNumerals}
                    activeColor="from-cyan-500 to-cyan-600"
                />

                {/* Theme Color - Spans 2 columns */}
                <div className="col-span-2">
                    <ControlButton
                        onClick={() => { }}
                        icon={Palette}
                        label={currentTheme.name}
                        active={true}
                        activeColor="from-orange-500 to-orange-600"
                        customContent={
                            <div
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                style={{ background: `hsl(${currentTheme.light.primary})` }}
                            />
                        }
                    />
                </div>
            </div>

            {/* Theme Color Picker */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground px-2">
                    Theme Colors
                </p>
                <div className="grid grid-cols-6 gap-2 p-2 rounded-xl bg-muted/30">
                    {themes.map((t) => {
                        const isActive = theme.color === t.color;
                        const colors = isDark ? t.dark : t.light;

                        return (
                            <button
                                key={t.color}
                                onClick={() => handleThemeChange(t.color as ThemeColor)}
                                className={cn(
                                    "group relative w-full aspect-square rounded-lg overflow-hidden",
                                    "transition-all duration-200 ease-out",
                                    "hover:scale-105 active:scale-95",
                                    isActive && "ring-2 ring-offset-2 ring-primary scale-105"
                                )}
                                aria-label={`Select ${t.name} theme`}
                            >
                                {/* Color Circle */}
                                <div
                                    className="w-full h-full rounded-lg"
                                    style={{ background: `hsl(${colors.primary})` }}
                                />

                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-white shadow-lg" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

interface ControlButtonProps {
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    active: boolean;
    activeColor: string;
    customContent?: React.ReactNode;
}

function ControlButton({
    onClick,
    icon: Icon,
    label,
    active,
    activeColor,
    customContent
}: ControlButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative flex flex-col items-center justify-center gap-2",
                "h-20 rounded-2xl overflow-hidden",
                "transition-all duration-200 ease-out",
                "active:scale-[0.98]",
                active
                    ? `bg-gradient-to-br ${activeColor} text-white shadow-md`
                    : "bg-muted/50 text-muted-foreground hover:bg-muted/80",
            )}
        >
            {/* Subtle Hover Overlay - Only on inactive */}
            {!active && (
                <div className={cn(
                    "absolute inset-0 bg-foreground/0 transition-colors duration-200",
                    "group-hover:bg-foreground/5"
                )} />
            )}

            {/* Icon */}
            <Icon className={cn(
                "relative z-10 w-5 h-5 transition-all duration-200",
                "group-active:scale-95"
            )} />

            {/* Label */}
            <span className="relative z-10 text-xs font-semibold">
                {label}
            </span>

            {/* Custom Content (like color indicator) */}
            {customContent && (
                <div className="relative z-10">
                    {customContent}
                </div>
            )}
        </button>
    );
}
