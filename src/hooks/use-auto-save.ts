"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface UseAutoSaveOptions<T> {
    data: T;
    onSave: (data: T) => Promise<void>;
    delay?: number;
}

export function useAutoSave<T>({ data, onSave, delay = 1000 }: UseAutoSaveOptions<T>) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const debouncedData = useDebounce(data, delay);

    useEffect(() => {
        const save = async () => {
            if (!debouncedData || lastSaved === null) return;

            try {
                setIsSaving(true);
                setError(null);
                await onSave(debouncedData);
                setLastSaved(new Date());
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Failed to save"));
            } finally {
                setIsSaving(false);
            }
        };

        save();
    }, [debouncedData, onSave]);

    // Initialize lastSaved
    useEffect(() => {
        if (lastSaved === null) {
            setLastSaved(new Date());
        }
    }, []);

    return {
        isSaving,
        lastSaved,
        error,
    };
}
