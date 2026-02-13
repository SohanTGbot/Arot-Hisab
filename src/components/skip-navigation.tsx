"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSkipNavigation } from "@/hooks/use-accessibility";

export function SkipNavigation() {
    const { skipToMainContent } = useSkipNavigation();

    return (
        <Button
            asChild
            variant="outline"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
            onClick={skipToMainContent}
        >
            <a href="#main-content">Skip to main content</a>
        </Button>
    );
}
