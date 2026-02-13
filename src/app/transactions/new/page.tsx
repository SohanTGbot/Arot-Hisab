"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberPad } from "@/components/ui/number-pad";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { calculateTransaction } from "@/lib/calculations";
import { useCreateTransaction } from "@/hooks/queries/use-transactions";
import { useNumberFormat } from "@/hooks/use-number-format";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

type Step = "grossWeight" | "ratePerKg";

const FIXED_DEDUCTION = 5; // Fixed 5%
const FIXED_COMMISSION = 2; // Fixed 2%

export default function NewTransactionPage() {
    const { t } = useI18n();
    const { formatCurrency } = useNumberFormat();
    const router = useRouter();
    const createTransaction = useCreateTransaction();

    const [currentStep, setCurrentStep] = useState<Step>("grossWeight");
    const [grossWeight, setGrossWeight] = useState("0");
    const [ratePerKg, setRatePerKg] = useState("0");
    const [sellerName, setSellerName] = useState("");
    const [buyerName, setBuyerName] = useState("");
    const [showOptional, setShowOptional] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load quick entry data if available
    useEffect(() => {
        const quickEntryData = sessionStorage.getItem('quickEntry');
        if (quickEntryData) {
            const data = JSON.parse(quickEntryData);
            setGrossWeight(data.grossWeight || "0");
            setRatePerKg(data.ratePerKg || "0");
            setSellerName(data.sellerName || "");
            setBuyerName(data.buyerName || "");
            sessionStorage.removeItem('quickEntry');
        }
    }, []);

    const getCurrentValue = () => {
        return currentStep === "grossWeight" ? grossWeight : ratePerKg;
    };

    const handleValueChange = (value: string) => {
        if (currentStep === "grossWeight") {
            setGrossWeight(value);
        } else {
            setRatePerKg(value);
        }
    };

    const handleNext = () => {
        const currentValue = parseFloat(getCurrentValue());

        if (currentStep === "grossWeight" && currentValue > 0) {
            setCurrentStep("ratePerKg");
        } else if (currentStep === "ratePerKg" && currentValue > 0) {
            handleSubmit();
        }
    };

    // Real-time calculation
    const calculation = calculateTransaction({
        grossWeightKg: parseFloat(grossWeight) || 0,
        ratePerKg: parseFloat(ratePerKg) || 0,
        deductionPercent: FIXED_DEDUCTION,
        commissionPercent: FIXED_COMMISSION,
    });

    const handleSubmit = async () => {
        if (parseFloat(grossWeight) <= 0 || parseFloat(ratePerKg) <= 0) {
            toast.error("Please enter valid values");
            return;
        }

        setLoading(true);
        try {
            await createTransaction.mutateAsync({
                buyer_name: buyerName || null,
                seller_name: sellerName || null,
                gross_weight_kg: parseFloat(grossWeight),
                net_weight_kg: calculation.netWeightKg,
                rate_per_kg: parseFloat(ratePerKg),
                base_amount: calculation.baseAmount,
                deduction_percent: FIXED_DEDUCTION,
                commission_percent: FIXED_COMMISSION,
                commission_amount: calculation.commissionAmount,
                final_amount: calculation.finalAmount,
                calculation_method: "B",
                notes: null,
            });

            toast.success(t("transactions.creating"));
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to create transaction");
        } finally {
            setLoading(false);
        }
    };

    const getStepTitle = () => {
        return currentStep === "grossWeight"
            ? t("transactions.grossWeight")
            : t("transactions.ratePerKg");
    };

    const getStepUnit = () => {
        return currentStep === "grossWeight" ? "kg" : "₹";
    };

    const showCalculation = parseFloat(grossWeight) > 0 && parseFloat(ratePerKg) > 0;

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-4 px-4 py-4 pb-24">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">{t("dashboard.newTransaction")}</h1>
                </div>

                {/* Compact Calculation Summary - Like Photo */}
                {showCalculation && (
                    <Card className="glass-card border-0">
                        <CardContent className="p-4">
                            {/* Top Row */}
                            <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Seller</div>
                                    <div className="font-medium truncate">{sellerName || "Raju Fishery"}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Gross WT</div>
                                    <div className="font-medium">{grossWeight}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Net WT (-5%)</div>
                                    <div className="font-medium">{format(calculation.netWeightKg)}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Rate</div>
                                    <div className="font-medium">{formatCurrency(parseFloat(ratePerKg))}</div>
                                </div>
                            </div>

                            {/* Bottom Row */}
                            <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t">
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Base Amt</div>
                                    <div className="font-medium">{formatCurrency(calculation.baseAmount)}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Final (+2%)</div>
                                    <div className="text-xl font-bold text-blue-600">{formatCurrency(calculation.finalAmount)}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Buyer</div>
                                    <div className="font-medium truncate">{buyerName || "M/S Kolkata"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Input Card */}
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-white/80">
                            {getStepTitle()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold">{formatCurrency(getCurrentValue()).replace(/[^0-9.,]/g, '')}</span>
                            <span className="text-2xl text-white/60">{getStepUnit()}</span>
                        </div>

                        {/* Optional Details */}
                        {currentStep === "grossWeight" && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowOptional(!showOptional)}
                                    className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                                >
                                    {showOptional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    {t("common.optional")} {t("common.details")}
                                </button>

                                {showOptional && (
                                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/20">
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
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Number Pad */}
                <NumberPad
                    value={getCurrentValue()}
                    onValueChange={handleValueChange}
                    onSubmit={handleNext}
                    className="px-2"
                    maxLength={8}
                    disabled={loading}
                />

                {/* Save Button (when both values entered) */}
                {showCalculation && currentStep === "ratePerKg" && (
                    <Button
                        onClick={handleSubmit}
                        loading={loading}
                        className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                    >
                        {t("transactions.saveTransaction")}
                    </Button>
                )}
            </div>
        </DashboardLayout>
    );
}
