"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { type TransactionFormData } from "@/lib/validations/forms";
import { useRouter } from "next/navigation";
import { useTransaction, useUpdateTransaction } from "@/hooks/queries/use-transactions";
import { toast } from "sonner";

interface EditTransactionPageProps {
    params: {
        id: string;
    };
}

export default function EditTransactionPage({ params }: EditTransactionPageProps) {
    const router = useRouter();
    const { data: transaction, isLoading, error } = useTransaction(params.id);
    const updateTransaction = useUpdateTransaction();

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-muted-foreground">Loading transaction...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !transaction) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <div className="text-destructive font-medium">Failed to load transaction</div>
                    <button
                        onClick={() => router.push("/transactions")}
                        className="text-sm text-primary underline"
                    >
                        Back to Transactions
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // Derive deduction percentage from stored values
    let derivedDeductionPercent = 5;
    if (transaction) {
        const gross = Number(transaction.gross_weight_kg);
        const net = Number(transaction.net_weight_kg);
        const method = transaction.deduction_method;

        if (gross > 0) {
            if (method === 'A') {
                // Method A: Net = Gross * (1 - d/100) => d = (1 - Net/Gross) * 100
                derivedDeductionPercent = (1 - (net / gross)) * 100;
            } else {
                // Method B: Net = (Kg * (1 - d/100)) + Grams
                const kg = Math.floor(gross);
                const grams = gross - kg;
                // Net - Grams = Kg * (1 - d/100)
                // (Net - Grams) / Kg = 1 - d/100
                // d/100 = 1 - (Net - Grams) / Kg
                // d = (1 - (Net - Grams) / Kg) * 100
                if (kg > 0) {
                    derivedDeductionPercent = (1 - ((net - grams) / kg)) * 100;
                }
            }
        }
        // Round to 1 decimal place to match UI step
        derivedDeductionPercent = Math.round(derivedDeductionPercent * 10) / 10;
        // If NaN or weird, fallback to 5
        if (isNaN(derivedDeductionPercent)) derivedDeductionPercent = 5;
    }

    const initialData: Partial<TransactionFormData> = {
        buyerName: transaction.buyer_name || "",
        sellerName: transaction.seller_name || "",
        grossWeight: Number(transaction.gross_weight_kg),
        ratePerKg: Number(transaction.rate_per_kg),
        deductionPercentage: derivedDeductionPercent,
        commissionPercentage: Number(transaction.commission_percent),
        calculationMethod: transaction.deduction_method as "A" | "B",
        notes: transaction.notes || "",
    };

    const handleSubmit = async (data: TransactionFormData) => {
        try {
            await updateTransaction.mutateAsync({
                id: params.id,
                updates: {
                    buyer_name: data.buyerName,
                    seller_name: data.sellerName,
                    gross_weight_kg: data.grossWeight,
                    rate_per_kg: data.ratePerKg,
                    deduction_method: data.calculationMethod,
                    commission_percent: data.commissionPercentage,
                    deduction_percent: data.deductionPercentage,
                    notes: data.notes,
                },
            });
            router.push("/transactions");
        } catch (error: any) {
            // Error handled by mutation or here
            console.error("Update failed", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Transaction</h1>
                    <p className="text-muted-foreground">
                        Update transaction details
                    </p>
                </div>

                <TransactionForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    isEdit
                />
            </div>
        </DashboardLayout>
    );
}
