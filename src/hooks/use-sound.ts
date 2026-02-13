"use client";

import { useCallback, useEffect, useState } from 'react';
import { soundManager, type SoundType, type SoundSettings } from '@/lib/sounds/sound-manager';

export function useSound() {
    const [settings, setSettings] = useState<SoundSettings>(soundManager.getSettings());

    // Update local state when settings change
    useEffect(() => {
        const interval = setInterval(() => {
            setSettings(soundManager.getSettings());
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const play = useCallback((type: SoundType) => {
        soundManager.play(type);
    }, []);

    const toggle = useCallback(() => {
        soundManager.toggle();
        setSettings(soundManager.getSettings());
    }, []);

    const setEnabled = useCallback((enabled: boolean) => {
        soundManager.setEnabled(enabled);
        setSettings(soundManager.getSettings());
    }, []);

    const setVolume = useCallback((volume: number) => {
        soundManager.setVolume(volume);
        setSettings(soundManager.getSettings());
    }, []);

    return {
        play,
        toggle,
        setEnabled,
        setVolume,
        enabled: settings.enabled,
        volume: settings.volume,
    };
}
