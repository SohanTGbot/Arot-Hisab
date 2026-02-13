"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeColor, ThemeMode } from './types';
import { getTheme } from './themes';

interface ThemeContextType {
    theme: Theme;
    setThemeColor: (color: ThemeColor) => void;
    setThemeMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>({
        color: 'default',
        mode: 'light',
    });
    const [mounted, setMounted] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('app-theme');
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Theme;
                setTheme(parsed);
            } catch (e) {
                console.error('Failed to parse theme from localStorage', e);
            }
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                setTheme((prev) => ({ ...prev, mode: 'dark' }));
            }
        }
        setMounted(true);
    }, []);

    // Apply CSS variables when theme changes
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const themeDefinition = getTheme(theme.color);
        const mode = theme.mode === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme.mode;

        const colors = mode === 'dark' ? themeDefinition.dark : themeDefinition.light;

        // Apply CSS variables
        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--primary-hover', colors.primaryHover);
        root.style.setProperty('--primary-light', colors.primaryLight);
        root.style.setProperty('--primary-dark', colors.primaryDark);
        root.style.setProperty('--background', colors.background);
        root.style.setProperty('--foreground', colors.foreground);
        root.style.setProperty('--card', colors.card);
        root.style.setProperty('--card-foreground', colors.cardForeground);
        root.style.setProperty('--muted', colors.muted);
        root.style.setProperty('--muted-foreground', colors.mutedForeground);
        root.style.setProperty('--border', colors.border);
        root.style.setProperty('--input', colors.input);
        root.style.setProperty('--ring', colors.ring);

        // Update dark class
        if (mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem('app-theme', JSON.stringify(theme));
    }, [theme, mounted]);

    // Listen to system preference changes  when mode is 'system'
    useEffect(() => {
        if (theme.mode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            setTheme((prev) => ({ ...prev })); // Trigger re-render
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme.mode]);

    const setThemeColor = (color: ThemeColor) => {
        setTheme((prev) => ({ ...prev, color }));
    };

    const setThemeMode = (mode: ThemeMode) => {
        setTheme((prev) => ({ ...prev, mode }));
    };

    const toggleMode = () => {
        setTheme((prev) => ({
            ...prev,
            mode: prev.mode === 'light' ? 'dark' : 'light',
        }));
    };

    // Prevent flash of unstyled content
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setThemeColor, setThemeMode, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
