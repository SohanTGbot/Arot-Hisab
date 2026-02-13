// Sound types for different interactions
export type SoundType =
    | 'click'           // Primary button click
    | 'tap'             // Secondary button tap
    | 'number'          // Number pad key
    | 'delete'          // Delete/backspace
    | 'clear'           // Clear action
    | 'success'         // Success feedback
    | 'error'           // Error feedback
    | 'warning'         // Warning feedback
    | 'navigate'        // Page navigation
    | 'open'            // Modal/drawer open
    | 'close'           // Modal/drawer close
    | 'toggle'          // Toggle switch
    | 'select';         // Item selection

export interface SoundSettings {
    enabled: boolean;
    volume: number; // 0-1
}

class SoundManager {
    private audioContext: AudioContext | null = null;
    private settings: SoundSettings = {
        enabled: true,
        volume: 0.3,
    };

    constructor() {
        this.loadSettings();
    }

    private loadSettings() {
        if (typeof window === 'undefined') return;

        const saved = localStorage.getItem('sound-settings');
        if (saved) {
            try {
                this.settings = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load sound settings:', e);
            }
        }
    }

    private saveSettings() {
        if (typeof window === 'undefined') return;
        localStorage.setItem('sound-settings', JSON.stringify(this.settings));
    }

    private getAudioContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    // Generate different sound frequencies
    private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
        if (!this.settings.enabled) return;

        try {
            const ctx = this.getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(this.settings.volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error('Failed to play sound:', e);
        }
    }

    // Different sound patterns for each type
    play(soundType: SoundType) {
        if (!this.settings.enabled) return;

        switch (soundType) {
            case 'click':
                // Satisfying click (refined tone)
                this.playTone(520, 0.04, 'sine');
                setTimeout(() => this.playTone(780, 0.02, 'sine'), 15);
                break;

            case 'tap':
                // Light gentle tap
                this.playTone(660, 0.025, 'sine');
                break;

            case 'number':
                // Soft keyboard click (less harsh)
                this.playTone(880, 0.015, 'sine');
                break;

            case 'delete':
                // Gentle backspace (soft descending)
                this.playTone(523, 0.03, 'sine');
                setTimeout(() => this.playTone(392, 0.025, 'sine'), 25);
                break;

            case 'clear':
                // Smooth whoosh (pleasant sweep)
                this.playTone(1047, 0.06, 'sine');
                setTimeout(() => this.playTone(659, 0.05, 'sine'), 25);
                setTimeout(() => this.playTone(440, 0.04, 'sine'), 45);
                break;

            case 'success':
                // Beautiful chime (major chord)
                this.playTone(523, 0.1, 'sine');  // C
                setTimeout(() => this.playTone(659, 0.12, 'sine'), 60);  // E
                setTimeout(() => this.playTone(784, 0.14, 'sine'), 120); // G
                break;

            case 'error':
                // Gentle notification (not harsh)
                this.playTone(349, 0.08, 'sine');
                setTimeout(() => this.playTone(294, 0.09, 'sine'), 70);
                break;

            case 'warning':
                // Alert but pleasant
                this.playTone(587, 0.06, 'sine');
                setTimeout(() => this.playTone(587, 0.06, 'sine'), 90);
                break;

            case 'navigate':
                // Smooth swoosh
                this.playTone(698, 0.05, 'sine');
                setTimeout(() => this.playTone(880, 0.03, 'sine'), 20);
                break;

            case 'open':
                // Pleasant pop-up (ascending sparkle)
                this.playTone(523, 0.035, 'sine');
                setTimeout(() => this.playTone(784, 0.04, 'sine'), 25);
                break;

            case 'close':
                // Gentle close (descending)
                this.playTone(784, 0.035, 'sine');
                setTimeout(() => this.playTone(523, 0.04, 'sine'), 25);
                break;

            case 'toggle':
                // Crisp switch
                this.playTone(659, 0.025, 'sine');
                setTimeout(() => this.playTone(880, 0.02, 'sine'), 15);
                break;

            case 'select':
                // Pleasant tick
                this.playTone(1047, 0.018, 'sine');
                break;
        }
    }

    setEnabled(enabled: boolean) {
        this.settings.enabled = enabled;
        this.saveSettings();
    }

    setVolume(volume: number) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    getSettings(): SoundSettings {
        return { ...this.settings };
    }

    toggle() {
        this.setEnabled(!this.settings.enabled);
    }
}

// Singleton instance
export const soundManager = new SoundManager();
