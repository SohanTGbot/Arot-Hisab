"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { useNumberFormat } from "@/hooks/use-number-format";
import { useRouter } from "next/navigation";

interface LatestCalculationCardProps {
    currentCalculation: {
        grossWeight: number;
        ratePerKg: number;
        netWeight: number;
        baseAmount: number;
        finalAmount: number;
        sellerName?: string;
        buyerName?: string;
    } | null;
    latestTransaction: any;
    className?: string;
}

export function LatestCalculationCard({ currentCalculation, latestTransaction, className }: LatestCalculationCardProps) {
    const router = useRouter();
    const { t } = useI18n();
    const { formatCurrency, format } = useNumberFormat();

    return (
        <Card className={`glass-card border-0 ${className}`}>
            <CardHeader className="pb-2 pt-3 px-3 sm:px-4">
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
            <CardContent className="pt-0 pb-3 px-3 sm:px-4">
                {/* Compact 2-Column Layout */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Seller */}
                    <div>
                        <div className="text-muted-foreground uppercase mb-0.5 tracking-wider font-semibold text-[10px]">{t("dashboard.calcSellerName")}</div>
                        <div className="font-medium truncate text-sm">
                            {currentCalculation?.sellerName || latestTransaction?.seller_name || '-'}
                        </div>
                    </div>
                    {/* Buyer */}
                    <div>
                        <div className="text-muted-foreground uppercase mb-0.5 tracking-wider font-semibold text-[10px]">{t("dashboard.calcBuyerName")}</div>
                        <div className="font-medium truncate text-sm">
                            {currentCalculation?.buyerName || latestTransaction?.buyer_name || '-'}
                        </div>
                    </div>
                    {/* Gross WT */}
                    <div>
                        <div className="text-muted-foreground uppercase mb-0.5 tracking-wider font-semibold text-[10px]">{t("dashboard.calcGrossWeight")}</div>
                        <div className="font-medium text-sm">
                            {format(currentCalculation?.grossWeight || latestTransaction?.gross_weight_kg || 0)}
                        </div>
                    </div>
                    {/* Net WT */}
                    <div>
                        <div className="text-muted-foreground uppercase mb-0.5 tracking-wider font-semibold text-[10px]">{t("dashboard.calcNetWeight")}</div>
                        <div className="font-medium text-sm">
                            {format(currentCalculation?.netWeight || latestTransaction?.net_weight_kg || 0)}
                        </div>
                    </div>
                    {/* Rate */}
                    <div>
                        <div className="text-muted-foreground uppercase mb-0.5 tracking-wider font-semibold text-[10px]">{t("dashboard.calcRate")}</div>
                        <div className="font-medium text-sm">
                            {formatCurrency(currentCalculation?.ratePerKg || latestTransaction?.rate_per_kg || 0)}
                        </div>
                    </div>
                    {/* Base Amount */}
                    <div>
                        <div className="text-muted-foreground uppercase mb-0.5 tracking-wider font-semibold text-[10px]">{t("dashboard.calcBaseAmount")}</div>
                        <div className="font-medium text-sm">
                            {formatCurrency(currentCalculation?.baseAmount || latestTransaction?.base_amount || 0)}
                        </div>
                    </div>
                    {/* Final Amount */}
                    <div className="col-span-2 mt-1 pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between">
                            <div className="text-muted-foreground uppercase tracking-wider font-bold text-[10px]">{t("dashboard.calcFinalAmount")}</div>
                            <div className="text-lg sm:text-xl font-bold text-primary">
                                {formatCurrency(currentCalculation?.finalAmount || latestTransaction?.final_amount || 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
