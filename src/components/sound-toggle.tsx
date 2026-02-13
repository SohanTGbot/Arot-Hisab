"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
    const { enabled, toggle, play } = useSound();

    const handleToggle = () => {
        if (!enabled) {
            // Play a test sound when enabling
            play('toggle');
        }
        toggle();
    };

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "flex items-center justify-center h-10 w-10 rounded-lg",
                "bg-background border border-border",
                "hover:bg-muted transition-all duration-200",
                "active:scale-95",
                className
            )}
            aria-label={enabled ? "Mute sounds" : "Unmute sounds"}
            title={enabled ? "Mute sounds" : "Unmute sounds"}
        >
            {enabled ? (
                <Volume2 className="h-5 w-5 text-foreground" />
            ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
        </button>
    );
}
