"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

type FontSize = 'small' | 'medium' | 'large';

const FONT_SIZE_KEY = 'aroti_font_size';

export function useSettings() {
    const [fontSize, setFontSizeState] = useState<FontSize>('medium');
    const { user } = useAuth();
    const supabase = createClient();

    // Load initial font size from localStorage
    useEffect(() => {
        const savedFontSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize;
        if (savedFontSize) {
            setFontSizeState(savedFontSize);
            applyFontSize(savedFontSize);
        }
    }, []);

    const applyFontSize = (size: FontSize) => {
        const sizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        document.documentElement.style.setProperty('--base-font-size', sizes[size]);
    };

    const setFontSize = async (size: FontSize) => {
        setFontSizeState(size);
        applyFontSize(size);
        localStorage.setItem(FONT_SIZE_KEY, size);

        // Ideally, sync with user profile if logged in
        if (user) {
            try {
                await supabase
                    .from('users')
                    .update({ font_size: size })
                    .eq('id', user.id);
            } catch (error) {
                console.error("Failed to sync font size preference:", error);
            }
        }
    };

    return {
        fontSize,
        setFontSize
    };
}
