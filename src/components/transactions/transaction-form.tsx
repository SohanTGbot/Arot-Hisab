"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, type TransactionFormData } from "@/lib/validations/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { calculateTransaction } from "@/lib/calculations";
import { NumberInput } from "@/components/transactions/number-input";
import { useI18n } from "@/lib/i18n/provider";

interface TransactionFormProps {
    onSubmit: (data: TransactionFormData) => Promise<void>;
    initialData?: Partial<TransactionFormData>;
    isEdit?: boolean;
}

export function TransactionForm({ onSubmit, initialData, isEdit }: TransactionFormProps) {
    const [loading, setLoading] = useState(false);
    const [calculation, setCalculation] = useState<ReturnType<typeof calculateTransaction> | null>(null);
    const { t } = useI18n();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema) as any,
        defaultValues: {
            buyerName: initialData?.buyerName || "",
            sellerName: initialData?.sellerName || "",
            grossWeight: initialData?.grossWeight || 0,
            ratePerKg: initialData?.ratePerKg || 0,
            deductionPercentage: initialData?.deductionPercentage ?? 5,
            commissionPercentage: initialData?.commissionPercentage ?? 2,
            calculationMethod: initialData?.calculationMethod || "B",
            notes: initialData?.notes || "",
        },
    });

    const grossWeight = watch("grossWeight");
    const ratePerKg = watch("ratePerKg");
    const deductionPercentage = watch("deductionPercentage");
    const commissionPercentage = watch("commissionPercentage");
    const calculationMethod = watch("calculationMethod");

    // Real-time calculation
    useEffect(() => {
        if (grossWeight && ratePerKg) {
            const result = calculateTransaction({
                grossWeightKg: grossWeight,
                ratePerKg,
                deductionMethod: calculationMethod || "B",
                deductionPercent: deductionPercentage || 5,
                commissionPercent: commissionPercentage || 2,
            });
            setCalculation(result);
        } else {
            setCalculation(null);
        }
    }, [grossWeight, ratePerKg, deductionPercentage, commissionPercentage, calculationMethod]);

    const handleFormSubmit = async (data: TransactionFormData) => {
        setLoading(true);
        try {
            await onSubmit(data);
            toast.success(isEdit ? "Transaction updated!" : "Transaction created!");
        } catch (error: any) {
            toast.error(error.message || "Failed to save transaction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-[calc(100vh-8rem)] md:h-auto md:block relative">
            {/* Scrollable Input Area */}
            <div className="flex-1 overflow-y-auto pb-32 md:pb-0 px-1 -mx-1 md:overflow-visible md:px-0 md:mx-0">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Left Column - Input Fields */}
                    <div className="space-y-4">
                        <Card glass className="border-0 shadow-none md:border md:shadow-sm bg-transparent md:bg-card">
                            <CardHeader className="px-0 md:px-6">
                                <CardTitle>{t("transactions.title")} {t("common.details")}</CardTitle>
                                <CardDescription>{t("common.enterInformation")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-0 md:px-6">
                                <div>
                                    <Label htmlFor="buyerName">{t("transactions.buyer")} {t("common.name")}</Label>
                                    <Input
                                        id="buyerName"
                                        {...register("buyerName")}
                                        error={errors.buyerName?.message}
                                        placeholder={t("common.enterName")}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="sellerName">{t("transactions.sellerName")}</Label>
                                    <Input
                                        id="sellerName"
                                        {...register("sellerName")}
                                        error={errors.sellerName?.message}
                                        placeholder={t("common.enterName")}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="grossWeight">{t("transactions.grossWeight")} (kg)</Label>
                                    <NumberInput
                                        label={t("transactions.grossWeight")}
                                        value={grossWeight}
                                        onChange={(val) => setValue("grossWeight", val)}
                                        error={errors.grossWeight?.message}
                                        placeholder="0.000"
                                        suffix="kg"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="ratePerKg">{t("transactions.ratePerKg")} (₹)</Label>
                                    <NumberInput
                                        label={t("transactions.ratePerKg")}
                                        value={ratePerKg}
                                        onChange={(val) => setValue("ratePerKg", val)}
                                        error={errors.ratePerKg?.message}
                                        placeholder="0.00"
                                        suffix="₹"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="deductionPercentage">{t("transactions.deductionPercentage")} (%)</Label>
                                        <NumberInput
                                            label={t("transactions.deductionPercentage")}
                                            value={deductionPercentage}
                                            onChange={(val) => setValue("deductionPercentage", val)}
                                            error={errors.deductionPercentage?.message}
                                            suffix="%"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="commissionPercentage">{t("transactions.commissionPercentage")} (%)</Label>
                                        <NumberInput
                                            label={t("transactions.commissionPercentage")}
                                            value={commissionPercentage}
                                            onChange={(val) => setValue("commissionPercentage", val)}
                                            error={errors.commissionPercentage?.message}
                                            suffix="%"
                                        />
                                    </div>
                                </div>

                                <input type="hidden" {...register("calculationMethod")} value="B" />

                                <div>
                                    <Label htmlFor="notes">{t("transactions.notes")} ({t("common.optional")})</Label>
                                    <textarea
                                        id="notes"
                                        {...register("notes")}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Add any notes..."
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Desktop Calculation Display */}
                    <div className="hidden md:block space-y-4">
                        <Card glass>
                            <CardHeader>
                                <CardTitle>{t("transactions.calculationSummary")}</CardTitle>
                                <CardDescription>{t("common.realtimeResults")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {calculation ? (
                                    <>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Gross Weight:</span>
                                                <span className="font-medium">{(calculation?.grossWeightKg || 0).toFixed(3)} kg</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Deduction ({deductionPercentage}%):</span>
                                                <span className="font-medium">{((calculation?.grossWeightKg || 0) - (calculation?.netWeightKg || 0)).toFixed(3)} kg</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-semibold">
                                                <span>Net Weight:</span>
                                                <span>{(calculation?.netWeightKg || 0).toFixed(3)} kg</span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Rate per Kg:</span>
                                                <span className="font-medium">₹{(calculation?.ratePerKg || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Base Amount:</span>
                                                <span className="font-medium">₹{calculation.baseAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Commission ({commissionPercentage}%):</span>
                                                <span className="font-medium">₹{calculation.commissionAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                                <span>Final Amount:</span>
                                                <span className="text-primary">₹{calculation.finalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                                            <p>Net Weight Calculation: Net = (Kg × 0.95) + Grams</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>{t("transactions.enterWeight")} {t("common.and")} {t("transactions.rate")}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Summary & Actions */}
            <div className="md:hidden fixed bottom-[56px] left-0 right-0 bg-background/95 backdrop-blur-xl border-t p-4 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-4 duration-300">
                {calculation ? (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-muted/50 p-2 rounded-lg text-center">
                            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Net Wt</div>
                            <div className="font-bold text-sm">{(calculation.netWeightKg).toFixed(3)} <span className="text-[10px] font-normal text-muted-foreground">kg</span></div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-lg text-center">
                            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Rate</div>
                            <div className="font-bold text-sm">₹{calculation.ratePerKg}</div>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-lg text-center border border-primary/20">
                            <div className="text-[10px] text-primary uppercase font-bold">Total</div>
                            <div className="font-bold text-sm text-primary">₹{Math.round(calculation.finalAmount).toLocaleString()}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-2 mb-3 text-sm text-muted-foreground bg-muted/30 rounded-lg">
                        Enter weight and rate to calculate
                    </div>
                )}

                <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} className="flex-[2] font-semibold">
                        {isEdit ? t("transactions.updating") : t("transactions.creating")}
                    </Button>
                </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex justify-end gap-4 mt-6">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" loading={loading}>
                    {isEdit ? t("transactions.updating") : t("transactions.creating")}
                </Button>
            </div>
        </form >
    );
}
