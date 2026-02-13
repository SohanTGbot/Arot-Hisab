"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = 'aroti_cookie_consent';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/80 backdrop-blur-md border-t shadow-lg animate-in slide-in-from-bottom duration-500">
            <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        🍪 Cookie Preferences
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                        By clicking "Accept All", you consent to our use of cookies.
                        Read our <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link> to learn more.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button variant="outline" onClick={handleReject} className="w-full sm:w-auto">
                        Reject All
                    </Button>
                    <Button onClick={handleAccept} className="w-full sm:w-auto">
                        Accept All
                    </Button>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 md:hidden text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </div>
        </div>
    );
}
