"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberPad } from "@/components/ui/number-pad";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { Weight } from "lucide-react";
import { useNumberFormat } from "@/hooks/use-number-format";

interface QuickEntryCardProps {
    onSubmit: (data: { grossWeight: string; ratePerKg: string; sellerName?: string; buyerName?: string }) => void;
    className?: string;
}

export function QuickEntryCard({ onSubmit, className }: QuickEntryCardProps) {
    const { t } = useI18n();
    const { format } = useNumberFormat();
    const [activeField, setActiveField] = useState<"grossWeight" | "ratePerKg">("grossWeight");
    const [grossWeight, setGrossWeight] = useState("0");
    const [ratePerKg, setRatePerKg] = useState("0");
    const [sellerName, setSellerName] = useState("");
    const [buyerName, setBuyerName] = useState("");
    const [showOptional, setShowOptional] = useState(false);

    const handleValueChange = (value: string) => {
        if (activeField === "grossWeight") {
            setGrossWeight(value);
        } else {
            setRatePerKg(value);
        }
    };

    const handleNext = () => {
        if (activeField === "grossWeight" && parseFloat(grossWeight) > 0) {
            setActiveField("ratePerKg");
        } else if (activeField === "ratePerKg" && parseFloat(ratePerKg) > 0) {
            // Submit the data
            onSubmit({
                grossWeight,
                ratePerKg,
                sellerName: sellerName || undefined,
                buyerName: buyerName || undefined,
            });
        }
    };

    const currentValue = activeField === "grossWeight" ? grossWeight : ratePerKg;

    return (
        <div className={cn("space-y-2", className)}>
            {/* New Entry Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white">
                <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="flex items-center gap-2 text-white text-base">
                        <Weight className="h-5 w-5" />
                        {t("dashboard.newTransaction")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pb-3 px-3">
                    {/* Main Inputs */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* Gross Weight */}
                        <button
                            type="button"
                            onClick={() => setActiveField("grossWeight")}
                            className={cn(
                                "flex flex-col items-start p-3 rounded-xl transition-all",
                                activeField === "grossWeight"
                                    ? "bg-white/20 ring-2 ring-white/50"
                                    : "bg-white/10 hover:bg-white/15"
                            )}
                        >
                            <Label className="text-xs text-white/80 mb-1">
                                {t("transactions.grossWeight")}
                            </Label>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl sm:text-3xl font-bold text-white">
                                    {activeField === "grossWeight" ? format(currentValue) : format(grossWeight)}
                                </span>
                                <span className="text-sm text-white/60">kg</span>
                            </div>
                        </button>

                        {/* Rate per Kg */}
                        <button
                            type="button"
                            onClick={() => setActiveField("ratePerKg")}
                            className={cn(
                                "flex flex-col items-start p-3 rounded-xl transition-all",
                                activeField === "ratePerKg"
                                    ? "bg-white/20 ring-2 ring-white/50"
                                    : "bg-white/10 hover:bg-white/15"
                            )}
                        >
                            <Label className="text-xs text-white/80 mb-1">
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
                        className="w-full text-center text-sm text-white/80 hover:text-white transition-colors py-2"
                    >
                        {showOptional ? "▼" : "▶"} {t("common.optional")} {t("common.details")}
                    </button>

                    {/* Optional Details */}
                    {showOptional && (
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/20">
                            <div>
                                <Label className="text-xs text-white/80">{t("transactions.sellerName")}</Label>
                                <Input
                                    value={sellerName}
                                    onChange={(e) => setSellerName(e.target.value)}
                                    placeholder={t("common.optional")}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-white/80">{t("transactions.buyer")} {t("common.name")}</Label>
                                <Input
                                    value={buyerName}
                                    onChange={(e) => setBuyerName(e.target.value)}
                                    placeholder={t("common.optional")}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Number Pad */}
            <NumberPad
                value={currentValue}
                onValueChange={handleValueChange}
                onSubmit={handleNext}
                className="px-2"
                maxLength={8}
            />
        </div>
    );
}
