"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useTransactions, useCreateTransaction } from "@/hooks/queries/use-transactions";
import { useSavedContacts } from "@/hooks/queries/use-contacts";
import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { DashboardSkeleton } from "@/components/loading-skeletons";
import { QuickEntryCard } from "@/components/dashboard/quick-entry-card";
import { toast } from "sonner";
import { calculateTransaction } from "@/lib/calculations";
import { MobileFitContainer } from "@/components/mobile-fit-container";
import { LatestCalculationCard } from "@/components/dashboard/latest-calculation-card";
// Removed useAuth import

export default function CalculatorPage() {
    const { t } = useI18n();

    // Calculator State
    const [grossWeight, setGrossWeight] = useState("0");
    const [ratePerKg, setRatePerKg] = useState("0");
    const [sellerName, setSellerName] = useState("");
    const [buyerName, setBuyerName] = useState("");
    const [activeField, setActiveField] = useState<"grossWeight" | "ratePerKg">("grossWeight");

    const [currentCalculation, setCurrentCalculation] = useState<{
        grossWeight: number;
        ratePerKg: number;
        netWeight: number;
        baseAmount: number;
        finalAmount: number;
        sellerName?: string;
        buyerName?: string;
    } | null>(null);

    const {
        data: transactions = [],
        isPending: transactionsPending,
        error: transactionsError,
    } = useTransactions();

    const { mutate: createTransaction, isPending: isSaving } = useCreateTransaction();

    const {
        data: contacts = [],
        isPending: contactsPending,
        error: contactsError
    } = useSavedContacts();

    const handleCalculate = () => {
        const gw = parseFloat(grossWeight);
        const rate = parseFloat(ratePerKg);

        if (isNaN(gw) || isNaN(rate) || gw <= 0 || rate <= 0) {
            toast.error(t("common.error") || "Invalid Input");
            return;
        }

        // Calculate using central logic
        const result = calculateTransaction({
            grossWeightKg: gw,
            ratePerKg: rate,
            deductionMethod: "B", // Defaulting to B as per previous logic, ideally from settings
            deductionPercent: 5,
            commissionPercent: 2
        });

        setCurrentCalculation({
            grossWeight: result.grossWeightKg,
            ratePerKg: result.ratePerKg,
            netWeight: result.netWeightKg,
            baseAmount: result.baseAmount,
            finalAmount: result.finalAmount,
            sellerName: sellerName || undefined,
            buyerName: buyerName || undefined,
        });

        // Loop back to start for next entry? Or keep values?
        // User workflow: Calculate -> Save -> Clear -> Next.
        // So we keep values visible so they can see what they calculated.

        import('@/lib/sounds/sound-manager').then(({ soundManager }) => {
            soundManager.play('success');
        });
    };

    const handleSave = () => {
        if (!currentCalculation) return;

        createTransaction({
            buyer_name: currentCalculation.buyerName || "Unknown",
            seller_name: currentCalculation.sellerName || "Unknown",
            // fish_type removed as it's not in schema
            gross_weight_kg: currentCalculation.grossWeight,
            rate_per_kg: currentCalculation.ratePerKg,
            commission_percent: 2,
            deduction_percent: 5,
            deduction_method: 'B',
            is_deleted: false,
            // method: 'B' // Method might be needed in DB schema?
        }, {
            onSuccess: () => {
                toast.success(t("transactions.saveTransaction") || "Transaction Saved");
                import('@/lib/sounds/sound-manager').then(({ soundManager }) => {
                    soundManager.play('success');
                });
                // "Immediately ready for next entry" -> Inputs stay populated?
                // Request says: "Calculate -> Save -> Next customer -> Clear -> New calculation"
                // So Save does NOT clear. Clear button clears.
            },
            onError: (error) => {
                toast.error(t("common.error") || "Failed to save");
                console.error(error);
            }
        });
    };

    const handleClear = () => {
        setCurrentCalculation(null);
        // Reset Inputs
        setGrossWeight("0");
        setRatePerKg("0");
        setSellerName("");
        setBuyerName("");
        setActiveField("grossWeight");

        import('@/lib/sounds/sound-manager').then(({ soundManager }) => {
            soundManager.play('click'); // Or some clear sound
        });
    };

    // Get latest transaction for compact card
    const latestTransaction = useMemo(() => {
        return transactions.length > 0
            ? [...transactions].sort((a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
            : null;
    }, [transactions]);

    if ((transactionsPending && transactions.length === 0) || (contactsPending && contacts.length === 0)) {
        return (
            <DashboardLayout>
                <div className="container p-4 space-y-6 pb-24 md:pb-6">
                    <DashboardSkeleton />
                </div>
            </DashboardLayout>
        );
    }

    if (transactionsError || contactsError) {
        return (
            <DashboardLayout>
                <div className="container p-4 flex items-center justify-center min-h-[50vh]">
                    <div className="text-center space-y-4">
                        <p className="text-red-500">Failed to load data</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const quickEntryProps = {
        grossWeight,
        ratePerKg,
        sellerName,
        buyerName,
        activeField,
        onGrossWeightChange: setGrossWeight,
        onRatePerKgChange: setRatePerKg,
        onSellerNameChange: setSellerName,
        onBuyerNameChange: setBuyerName,
        onActiveFieldChange: setActiveField,
        onSubmit: handleCalculate
    };

    return (
        <DashboardLayout>
            {/* Mobile View - Responsive Vertical Layout */}
            <div className="lg:hidden h-full flex flex-col w-full max-w-md mx-auto">
                <div className="flex flex-col h-full space-y-2 p-2">
                    {/* Top: Summary Card */}
                    <div className="flex-shrink-0">
                        <LatestCalculationCard
                            currentCalculation={currentCalculation}
                            latestTransaction={latestTransaction}
                            onSave={handleSave}
                            onClear={handleClear}
                            isSaving={isSaving}
                        />
                    </div>

                    {/* Bottom: Quick Entry Card (Grows to fill space) */}
                    <QuickEntryCard
                        {...quickEntryProps}
                        className="flex-1 min-h-0"
                    />
                </div>
            </div>

            {/* Desktop View - Centered Calculator */}
            <div className="hidden lg:flex flex-col items-center justify-start pt-10 min-h-[80vh] space-y-6">
                <div className="w-full max-w-2xl space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t("nav.calculator")}</h1>
                    <LatestCalculationCard
                        currentCalculation={currentCalculation}
                        latestTransaction={latestTransaction}
                        className="shadow-md"
                        onSave={handleSave}
                        onClear={handleClear}
                        isSaving={isSaving}
                    />
                    <QuickEntryCard
                        {...quickEntryProps}
                        className="shadow-lg"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
