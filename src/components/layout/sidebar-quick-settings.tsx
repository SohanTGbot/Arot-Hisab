"use client";

import * as React from "react";
import { Volume2, VolumeX, Globe, Palette, Moon, Sun, Hash } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import { useI18n } from "@/lib/i18n/provider";
import { useTheme } from "@/lib/theme/theme-provider";
import { themes } from "@/lib/theme/themes";
import { cn } from "@/lib/utils";
import type { ThemeColor } from "@/lib/theme/types";


export function SidebarQuickSettings() {
    const { enabled: soundEnabled, toggle: toggleSound, play } = useSound();
    const { language, setLanguage, useBengaliNumerals, toggleNumerals } = useI18n();
    const { theme, setThemeColor, toggleMode } = useTheme();

    const handleSoundToggle = () => {
        if (!soundEnabled) play('toggle');
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

    const isDark = theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className="p-4 space-y-4 border-t border-border/60 bg-gradient-to-t from-muted/20 to-transparent">
            <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                Quick Settings
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
                <SettingsToggle
                    icon={soundEnabled ? Volume2 : VolumeX}
                    label={soundEnabled ? "Sound On" : "Muted"}
                    active={soundEnabled}
                    onClick={handleSoundToggle}
                />
                <SettingsToggle
                    icon={Globe}
                    label={language === "en" ? "English" : "বাংলা"}
                    active={language === "bn"} // Highlight if BN
                    onClick={handleLanguageToggle}
                />
                <SettingsToggle
                    icon={isDark ? Moon : Sun}
                    label={isDark ? "Dark" : "Light"}
                    active={isDark}
                    onClick={handleModeToggle}
                />
                <SettingsToggle
                    icon={Hash}
                    label={useBengaliNumerals ? "১২৩" : "123"}
                    active={useBengaliNumerals}
                    onClick={handleNumeralsToggle}
                />
            </div>

            {/* Compact Theme Picker */}
            <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest pl-1">Theme Colors</p>
                <div className="flex flex-wrap gap-1.5">
                    {themes.map((t) => {
                        const isActive = theme.color === t.color;
                        const colors = isDark ? t.dark : t.light;
                        return (
                            <button
                                key={t.color}
                                onClick={() => {
                                    play('select');
                                    setThemeColor(t.color as ThemeColor);
                                }}
                                className={cn(
                                    "w-6 h-6 rounded-full transition-all hover:scale-110",
                                    isActive && "ring-2 ring-primary ring-offset-2 scale-110"
                                )}
                                style={{ background: `hsl(${colors.primary})` }}
                                title={t.name}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function SettingsToggle({
    icon: Icon,
    label,
    active,
    onClick
}: {
    icon: any;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            title={label}
            className={cn(
                "group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 w-full active:scale-95",
                active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10 ring-1 ring-primary/20"
                    : "bg-muted/40 text-foreground/80 hover:bg-muted/60 hover:text-foreground hover:shadow-sm ring-1 ring-border/50"
            )}
        >
            <div className={cn(
                "p-1 rounded-lg transition-colors",
                active ? "bg-primary-foreground/20" : "bg-background/80 group-hover:bg-background"
            )}>
                <Icon className="w-4 h-4 shrink-0" />
            </div>
            <span className="text-xs font-medium truncate">{label}</span>
        </button>
    );
}
