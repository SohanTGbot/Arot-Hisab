"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberPad } from "@/components/ui/number-pad";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { Weight } from "lucide-react";
import { useNumberFormat } from "@/hooks/use-number-format";
import { useState } from "react";

export interface QuickEntryCardProps {
    grossWeight: string;
    ratePerKg: string;
    sellerName: string;
    buyerName: string;
    activeField: "grossWeight" | "ratePerKg";
    onGrossWeightChange: (value: string) => void;
    onRatePerKgChange: (value: string) => void;
    onSellerNameChange: (value: string) => void;
    onBuyerNameChange: (value: string) => void;
    onActiveFieldChange: (field: "grossWeight" | "ratePerKg") => void;
    onSubmit: () => void;
    className?: string;
}

export function QuickEntryCard({
    grossWeight,
    ratePerKg,
    sellerName,
    buyerName,
    activeField,
    onGrossWeightChange,
    onRatePerKgChange,
    onSellerNameChange,
    onBuyerNameChange,
    onActiveFieldChange,
    onSubmit,
    className
}: QuickEntryCardProps) {
    const { t } = useI18n();
    const { format } = useNumberFormat();
    const [showOptional, setShowOptional] = useState(false);

    const handleValueChange = (value: string) => {
        if (activeField === "grossWeight") {
            onGrossWeightChange(value);
        } else {
            onRatePerKgChange(value);
        }
    };

    const handleNext = () => {
        if (activeField === "grossWeight" && parseFloat(grossWeight) > 0) {
            onActiveFieldChange("ratePerKg");
        } else if (activeField === "ratePerKg" && parseFloat(ratePerKg) > 0) {
            onSubmit();
        }
    };

    const currentValue = activeField === "grossWeight" ? grossWeight : ratePerKg;

    return (
        <div className={cn("flex flex-col h-full space-y-2", className)}>
            {/* New Entry Card */}
            <Card className="flex flex-col flex-1 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 border-0 text-white overflow-hidden shadow-xl shadow-blue-900/20">
                <CardHeader className="flex-shrink-0 pb-2 pt-3 px-3">
                    <CardTitle className="flex items-center gap-2 text-white text-base">
                        <Weight className="h-5 w-5" />
                        {t("dashboard.newTransaction")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 min-h-0 space-y-3 pb-3 px-3">
                    {/* Main Inputs */}
                    <div className="flex-shrink-0 grid grid-cols-2 gap-2">
                        {/* Gross Weight */}
                        <button
                            type="button"
                            onClick={() => onActiveFieldChange("grossWeight")}
                            className={cn(
                                "flex flex-col items-start p-3 rounded-xl transition-all duration-200 active:scale-95",
                                activeField === "grossWeight"
                                    ? "bg-white/20 ring-2 ring-white/50 shadow-lg"
                                    : "bg-white/10 hover:bg-white/15 hover:shadow-md"
                            )}
                        >
                            <Label className="text-xs text-white/80 mb-1 cursor-pointer">
                                {t("transactions.grossWeight")}
                            </Label>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                    {activeField === "grossWeight" ? format(currentValue) : format(grossWeight)}
                                </span>
                                <span className="text-sm text-white/60 font-medium">kg</span>
                            </div>
                        </button>

                        {/* Rate per Kg */}
                        <button
                            type="button"
                            onClick={() => onActiveFieldChange("ratePerKg")}
                            className={cn(
                                "flex flex-col items-start p-3 rounded-xl transition-all duration-200 active:scale-95",
                                activeField === "ratePerKg"
                                    ? "bg-white/20 ring-2 ring-white/50 shadow-lg"
                                    : "bg-white/10 hover:bg-white/15 hover:shadow-md"
                            )}
                        >
                            <Label className="text-xs text-white/80 mb-1 cursor-pointer">
                                {t("transactions.ratePerKg")}
                            </Label>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl sm:text-3xl font-bold text-white">
                                    {activeField === "ratePerKg" ? format(currentValue) : format(ratePerKg)}
                                </span>
                                <span className="text-sm text-white/60">₹</span>
                            </div>
                        </button>
                    </div>

                    {/* Optional Details Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowOptional(!showOptional)}
                        className="flex-shrink-0 w-full text-center text-sm text-white/80 hover:text-white transition-colors py-1"
                    >
                        {showOptional ? "▼" : "▶"} {t("common.optional")} {t("common.details")}
                    </button>

                    {/* Optional Details */}
                    {showOptional && (
                        <div className="flex-shrink-0 grid grid-cols-2 gap-3 pt-2 border-t border-white/20">
                            <div>
                                <Label className="text-xs text-white/80">{t("transactions.sellerName")}</Label>
                                <Input
                                    value={sellerName}
                                    onChange={(e) => onSellerNameChange(e.target.value)}
                                    placeholder={t("common.optional")}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-white/80">{t("transactions.buyer")} {t("common.name")}</Label>
                                <Input
                                    value={buyerName}
                                    onChange={(e) => onBuyerNameChange(e.target.value)}
                                    placeholder={t("common.optional")}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* Number Pad */}
                    <div className="flex-1 min-h-[220px]">
                        <NumberPad
                            value={currentValue}
                            onValueChange={handleValueChange}
                            onSubmit={handleNext}
                            className="px-2 h-full"
                            maxLength={8}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
