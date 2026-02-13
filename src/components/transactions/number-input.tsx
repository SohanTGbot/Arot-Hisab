"use client";

import { useState, useEffect } from "react";
import { NumberPad } from "@/components/ui/number-pad";
import { MobileSheet } from "@/components/mobile-sheet";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";

interface NumberInputProps {
    value: number | undefined;
    onChange: (value: number) => void;
    label: string;
    placeholder?: string;
    suffix?: string;
    error?: string;
    className?: string;
}

export function NumberInput({
    value,
    onChange,
    label,
    placeholder = "0",
    suffix,
    error,
    className,
}: NumberInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    // Local string state to handle specific formatting or intermediate states if needed
    // But for simplicity, we'll sync with the prop value
    const [displayValue, setDisplayValue] = useState(value?.toString() || "");

    useEffect(() => {
        if (value !== undefined && value !== null) {
            setDisplayValue(value.toString());
        } else {
            setDisplayValue("");
        }
    }, [value]);

    const handlePadChange = (newValue: string) => {
        setDisplayValue(newValue);
        // Parse float immediately so parent form gets number
        const num = parseFloat(newValue);
        if (!isNaN(num)) {
            onChange(num);
        } else if (newValue === "") {
            onChange(0); // or handle as undefined? Form expects number usually.
        }
    };

    const handleSubmit = () => {
        setIsOpen(false);
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div
                onClick={() => setIsOpen(true)}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer items-center",
                    error && "border-destructive"
                )}
            >
                <span className={cn("flex-1", !displayValue && "text-muted-foreground")}>
                    {displayValue || placeholder}
                </span>
                {suffix && <span className="text-muted-foreground ml-2">{suffix}</span>}
                <Calculator className="h-4 w-4 text-muted-foreground ml-2 opacity-50" />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <MobileSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={label}
            >
                <div className="pb-8">
                    <div className="mb-4 flex justify-end px-2">
                        <div className="text-4xl font-bold tracking-tight">
                            {displayValue || "0"}
                            {suffix && <span className="text-muted-foreground text-2xl ml-2">{suffix}</span>}
                        </div>
                    </div>
                    <NumberPad
                        value={displayValue || "0"}
                        onValueChange={handlePadChange}
                        onSubmit={handleSubmit}
                        maxLength={10}
                    />
                </div>
            </MobileSheet>
        </div>
    );
}
