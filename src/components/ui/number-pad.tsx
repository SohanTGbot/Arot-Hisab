import * as React from "react"
import { Delete, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/provider"
import { useNumberFormat } from "@/hooks/use-number-format"

interface NumberPadProps {
    value: string
    onValueChange: (value: string) => void
    onSubmit?: () => void
    className?: string
    maxLength?: number
    disabled?: boolean
}

export function NumberPad({
    value,
    onValueChange,
    onSubmit,
    className,
    maxLength = 10,
    disabled = false
}: NumberPadProps) {
    const { t } = useI18n();
    const { format } = useNumberFormat();

    const playSound = (type: 'number' | 'delete' | 'clear' | 'success') => {
        import('@/lib/sounds/sound-manager').then(({ soundManager }) => {
            soundManager.play(type);
        });
    };

    const handleNumberClick = (num: string) => {
        if (value.length >= maxLength) return

        // Prevent multiple decimals
        if (num === "." && value.includes(".")) return

        playSound('number');

        // If value is "0" and input is not ".", replace it (unless input is ".", then append)
        if (value === "0" && num !== ".") {
            onValueChange(num)
        } else {
            onValueChange(value + num)
        }
    }

    const handleBackspace = () => {
        playSound('delete');
        if (value.length <= 1) {
            onValueChange("0")
        } else {
            onValueChange(value.slice(0, -1))
        }
    }

    const handleClear = () => {
        playSound('clear');
        onValueChange("0")
    }

    const handleSubmit = () => {
        playSound('success');
        onSubmit?.();
    }

    return (
        <div className={cn("grid grid-cols-4 gap-1.5 sm:gap-2 p-1 rounded-2xl bg-gradient-to-br from-gray-50 to-white select-none", className)}>
            {/* Row 1 */}
            <NumButton onClick={() => handleNumberClick("7")}>{format("7")}</NumButton>
            <NumButton onClick={() => handleNumberClick("8")}>{format("8")}</NumButton>
            <NumButton onClick={() => handleNumberClick("9")}>{format("9")}</NumButton>
            <ActionButton
                onClick={handleBackspace}
                className="bg-gradient-to-br from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 border border-red-200"
            >
                <Delete className="h-5 w-5" />
            </ActionButton>

            {/* Row 2 */}
            <NumButton onClick={() => handleNumberClick("4")}>{format("4")}</NumButton>
            <NumButton onClick={() => handleNumberClick("5")}>{format("5")}</NumButton>
            <NumButton onClick={() => handleNumberClick("6")}>{format("6")}</NumButton>
            <ActionButton
                onClick={handleClear}
                className="bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 hover:from-orange-100 hover:to-orange-200 border border-orange-200 text-xl"
            >
                C
            </ActionButton>

            {/* Row 3 */}
            <NumButton onClick={() => handleNumberClick("1")}>{format("1")}</NumButton>
            <NumButton onClick={() => handleNumberClick("2")}>{format("2")}</NumButton>
            <NumButton onClick={() => handleNumberClick("3")}>{format("3")}</NumButton>

            {/* NEXT Button - Spans Row 3 & 4 */}
            <button
                type="button"
                className={cn(
                    "group relative row-span-2 flex flex-col items-center justify-center gap-1 h-full w-full rounded-xl overflow-hidden",
                    "bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700",
                    "text-white font-bold shadow-lg hover:shadow-xl",
                    "transition-all duration-200",
                    "active:scale-95 hover:scale-[1.02]",
                    "touch-target",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleSubmit}
                disabled={disabled}
            >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/10 transition-all duration-300" />

                <span className="relative z-10 text-sm">NEXT</span>
                <span className="relative z-10 text-xs opacity-90">{t("common.next")}</span>
                <ArrowRight className="relative z-10 h-5 w-5" />
            </button>

            {/* Row 4 */}
            <NumButton onClick={() => handleNumberClick(".")}>.</NumButton>
            <NumButton onClick={() => handleNumberClick("0")}>{format("0")}</NumButton>
            <NumButton onClick={() => handleNumberClick("00")}>{format("00")}</NumButton>
        </div>
    )
}

interface NumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
}

function NumButton({ children, className, ...props }: NumButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                "group relative flex items-center justify-center h-12 sm:h-14 w-full text-xl sm:text-2xl font-semibold",
                "bg-gradient-to-br from-white to-gray-50 text-gray-900",
                "border border-gray-200 hover:border-blue-300",
                "rounded-xl shadow-sm hover:shadow-md",
                "transition-all duration-200",
                "active:scale-95 hover:scale-[1.02]",
                "touch-target",
                "overflow-hidden",
                className
            )}
            {...props}
        >
            {/* Subtle hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/10 transition-all duration-200 rounded-xl" />

            <span className="relative z-10">{children}</span>
        </button>
    )
}

function ActionButton({ children, className, ...props }: NumButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                "flex items-center justify-center h-12 sm:h-14 w-full",
                "rounded-xl shadow-sm hover:shadow-md",
                "transition-all duration-200",
                "active:scale-95 hover:scale-[1.02]",
                "touch-target font-semibold",
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
