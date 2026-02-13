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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column - Input Fields */}
                <div className="space-y-4">
                    <Card glass>
                        <CardHeader>
                            <CardTitle>{t("transactions.title")} {t("common.details")}</CardTitle>
                            <CardDescription>{t("common.enterInformation")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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

                {/* Right Column - Calculation Display */}
                <div className="space-y-4">
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

            <div className="flex justify-end gap-4">
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
