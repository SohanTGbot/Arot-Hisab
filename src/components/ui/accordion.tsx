"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { type?: "single" | "multiple"; collapsible?: boolean }
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1", className)} {...props} />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    // Note: This is a simplified version. A full version would use context to manage open state.
    // For now, we'll rely on the user finding a way to make it interactive or we improve it later.
    // Actually, let's implement a basic context to make it functional.
    return (
        <button
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </button>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            className
        )}
        {...props}
    >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </div>
))
AccordionContent.displayName = "AccordionContent"

// Simple Context-based implementation for interactivity
import { createContext, useContext, useState } from "react"

type AccordionContextType = {
    value: string | string[] | undefined
    onValueChange: (value: string) => void
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

const AccordionRoot = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        type?: "single" | "multiple";
        collapsible?: boolean;
        defaultValue?: string | string[];
        value?: string | string[];
        onValueChange?: (value: string | string[]) => void;
    }
>(({ type = "single", collapsible = false, defaultValue, value: controlledValue, onValueChange, className, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState<string | string[] | undefined>(defaultValue)

    const value = controlledValue !== undefined ? controlledValue : internalValue

    const handleValueChange = (itemValue: string) => {
        let newValue: string | string[] | undefined

        if (type === "single") {
            if (value === itemValue && collapsible) {
                newValue = ""
            } else {
                newValue = itemValue
            }
        } else {
            // multiple not implemented for simplicity in this fallback
            newValue = itemValue
        }

        if (onValueChange) {
            onValueChange(newValue)
        } else {
            setInternalValue(newValue)
        }
    }

    return (
        <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div ref={ref} className={cn("", className)} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    )
})
AccordionRoot.displayName = "Accordion"

// Wrapper components to connect Context
const AccordionTriggerWithContext = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string } // We need value here usually but it's on Item
>(({ className, children, onClick, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useContext(AccordionContext)!
    // Context doesn't know "this" item's value directly unless passed or determined from parent Item.
    // Standard Radix uses specific data flow. 
    // Let's modify AccordionItem to pass context down.
    return (
        <AccordionTrigger ref={ref} className={className} onClick={onClick} {...props}>
            {children}
        </AccordionTrigger>
    )
})

// RE-IMPLEMENTATION: Simpler approach - Custom Accordion without Radix
// This file exports the same API surfaced in the pages.

export function SimpleAccordion({ type, collapsible, className, children, ...props }: any) {
    const [openItem, setOpenItem] = useState<string | null>(null);

    const toggle = (value: string) => {
        setOpenItem(prev => prev === value ? (collapsible ? null : prev) : value);
    };

    return (
        <div className={cn("space-y-1", className)} {...props}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as any, { openItem, toggle });
                }
                return child;
            })}
        </div>
    )
}

export function SimpleAccordionItem({ value, openItem, toggle, className, children, ...props }: any) {
    const isOpen = openItem === value;
    return (
        <div className={cn("border-b", className)} {...props}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // Pass state to Trigger and Content
                    return React.cloneElement(child as any, { isOpen, onClick: () => toggle(value) });
                }
                return child;
            })}
        </div>
    )
}

export function SimpleAccordionTrigger({ isOpen, onClick, className, children, ...props }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
                isOpen && "[&>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </button>
    )
}

export function SimpleAccordionContent({ isOpen, className, children, ...props }: any) {
    if (!isOpen) return null;
    return (
        <div
            className={cn(
                "overflow-hidden text-sm transition-all animate-in slide-in-from-top-1",
                className
            )}
            {...props}
        >
            <div className={cn("pb-4 pt-0", className)}>{children}</div>
        </div>
    )
}

// Aliases to match the imports in help/page.tsx
export { SimpleAccordion as Accordion }
export { SimpleAccordionItem as AccordionItem }
export { SimpleAccordionTrigger as AccordionTrigger }
export { SimpleAccordionContent as AccordionContent }
