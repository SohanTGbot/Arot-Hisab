// Theme Types

export type ThemeColor = 'default' | 'emerald' | 'purple' | 'orange' | 'rose' | 'dark-pro';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
    color: ThemeColor;
    mode: ThemeMode;
}

export interface ThemeColors {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryDark: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
}

export interface ThemeDefinition {
    name: string;
    color: ThemeColor;
    light: ThemeColors;
    dark: ThemeColors;
}
