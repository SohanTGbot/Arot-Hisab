"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickEntryCard } from "@/components/dashboard/quick-entry-card";
import { useI18n } from "@/lib/i18n/provider";
import { useRouter } from "next/navigation";
import { useTransactions } from "@/hooks/queries/use-transactions";
import { formatDistanceToNow } from "@/lib/utils";
import { useNumberFormat } from "@/hooks/use-number-format";
import { TrendingUp, User, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function MobileDashboardPage() {
    const { t } = useI18n();
    const router = useRouter();
    const { formatCurrency, format } = useNumberFormat();
    const { data: transactions = [], isLoading } = useTransactions();

    // Get latest transaction
    const latestTransaction = transactions.length > 0
        ? [...transactions].sort((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]
        : null;

    const handleQuickEntry = (data: { grossWeight: string; ratePerKg: string; sellerName?: string; buyerName?: string }) => {
        // Store in session storage and navigate to full form
        sessionStorage.setItem('quickEntry', JSON.stringify(data));
        router.push('/transactions/new');
        toast.success(t("common.next"));
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-4 px-4 py-4 pb-24">
                {/* Latest Calculation - Compact Photo Style */}
                {latestTransaction && (
                    <Card className="glass-card border-0">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    {t("dashboard.latestCalculation")}
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push('/transactions')}
                                    className="text-blue-600 h-8"
                                >
                                    {t("dashboard.viewHistory")}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {/* Top Row */}
                            <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Seller</div>
                                    <div className="font-medium truncate">{latestTransaction.seller_name || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Gross WT</div>
                                    <div className="font-medium">{format(latestTransaction.gross_weight_kg || 0)}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Net WT (-5%)</div>
                                    <div className="font-medium">{format(latestTransaction.net_weight_kg || 0)}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Rate</div>
                                    <div className="font-medium">{formatCurrency(latestTransaction.rate_per_kg || 0)}</div>
                                </div>
                            </div>

                            {/* Bottom Row */}
                            <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t">
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Base Amt</div>
                                    <div className="font-medium">{formatCurrency(latestTransaction.base_amount || 0)}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Final (+2%)</div>
                                    <div className="text-xl font-bold text-blue-600">{formatCurrency(latestTransaction.final_amount || 0)}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground uppercase mb-1">Buyer</div>
                                    <div className="font-medium truncate">{latestTransaction.buyer_name || '-'}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Entry Card */}
                <QuickEntryCard onSubmit={handleQuickEntry} />
            </div>
        </DashboardLayout>
    );
}
