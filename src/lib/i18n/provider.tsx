"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './config';

type Language = 'en' | 'bn';

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, options?: any) => string;
    useBengaliNumerals: boolean;
    toggleNumerals: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const { t, i18n: i18nInstance } = useTranslation();
    const [language, setLanguageState] = useState<Language>('en');
    const [useBengaliNumerals, setUseBengaliNumerals] = useState<boolean>(false);

    useEffect(() => {
        // Initialize language from i18n
        const currentLang = i18nInstance.language as Language;
        if (currentLang && currentLang !== language) {
            setLanguageState(currentLang);
        }

        // Initialize Bengali numerals preference from localStorage
        const savedNumeralPref = localStorage.getItem('useBengaliNumerals');
        if (savedNumeralPref !== null) {
            setUseBengaliNumerals(savedNumeralPref === 'true');
        }
    }, [i18nInstance.language]);

    const setLanguage = (lang: Language) => {
        i18nInstance.changeLanguage(lang);
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const toggleNumerals = () => {
        const newValue = !useBengaliNumerals;
        setUseBengaliNumerals(newValue);
        localStorage.setItem('useBengaliNumerals', String(newValue));
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t, useBengaliNumerals, toggleNumerals }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}
