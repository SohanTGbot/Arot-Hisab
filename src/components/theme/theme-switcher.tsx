"use client";

import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '@/lib/theme/theme-provider';
import { themes } from '@/lib/theme/themes';
import { ThemeColor } from '@/lib/theme/types';
import { cn } from '@/lib/utils';

export function ThemeSwitcher() {
    const { theme, setThemeColor, toggleMode } = useTheme();
    const [open, setOpen] = React.useState(false);

    const currentTheme = themes.find((t) => t.color === theme.color) || themes[0];

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg",
                    "bg-white border border-gray-200",
                    "hover:border-gray-300 hover:shadow-sm",
                    "transition-all duration-200"
                )}
                aria-label="Change theme"
            >
                <Palette className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{currentTheme.name}</span>
            </button>

            {/* Theme Picker Dropdown */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 z-50 w-80 p-4 bg-white rounded-xl border border-gray-200 shadow-xl">
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">Choose Theme</h3>
                                <button
                                    onClick={toggleMode}
                                    className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                >
                                    {theme.mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
                                </button>
                            </div>

                            {/* Theme Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                {themes.map((t) => {
                                    const isActive = theme.color === t.color;
                                    const colors = theme.mode === 'dark' ? t.dark : t.light;

                                    return (
                                        <button
                                            key={t.color}
                                            onClick={() => {
                                                setThemeColor(t.color as ThemeColor);
                                                setTimeout(() => setOpen(false), 300);
                                            }}
                                            className={cn(
                                                "relative group flex flex-col items-center gap-2 p-3 rounded-lg",
                                                "border-2 transition-all duration-200",
                                                isActive
                                                    ? "border-gray-900 bg-gray-50"
                                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            )}
                                        >
                                            {/* Color Preview Circle */}
                                            <div
                                                className="w-10 h-10 rounded-full shadow-sm transition-transform group-hover:scale-110"
                                                style={{
                                                    background: `hsl(${colors.primary})`,
                                                }}
                                            />

                                            {/* Theme Name */}
                                            <span className={cn(
                                                "text-xs font-medium",
                                                isActive ? "text-gray-900" : "text-gray-600"
                                            )}>
                                                {t.name}
                                            </span>

                                            {/* Active Indicator */}
                                            {isActive && (
                                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gray-900" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Info Text */}
                            <p className="text-xs text-gray-500 text-center">
                                Theme will apply instantly across the app
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
