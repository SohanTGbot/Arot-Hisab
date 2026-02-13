"use client";

import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
    const { language, setLanguage } = useI18n();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'bn' : 'en');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className={cn("gap-2", className)}
            title="Change Language"
        >
            <Languages className="h-4 w-4" />
            <span className="text-sm font-medium">
                {language === 'en' ? 'বাংলা' : 'English'}
            </span>
        </Button>
    );
}
