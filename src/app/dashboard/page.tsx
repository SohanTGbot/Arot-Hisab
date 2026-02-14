"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, TrendingUp, Users, DollarSign, Plus, ArrowRight, FileText, Activity, Wallet } from "lucide-react";
import Link from "next/link";
import { useTransactions } from "@/hooks/queries/use-transactions";
import { useSavedContacts } from "@/hooks/queries/use-contacts";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { StatCard, QuickAction, ActivityItem } from "@/components/dashboard/dashboard-components";
import { DashboardSkeleton } from "@/components/loading-skeletons";
import { EmptyState } from "@/components/empty-state";
import { formatDistanceToNow } from "@/lib/utils";
import { useNumberFormat } from "@/hooks/use-number-format";
import { motion } from "framer-motion";
import { ExtendedMobileFAB } from "@/components/mobile-fab";
import { QuickEntryCard } from "@/components/dashboard/quick-entry-card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { calculateTransaction } from "@/lib/calculations";
import { MobileFitContainer } from "@/components/mobile-fit-container";
import { LatestCalculationCard } from "@/components/dashboard/latest-calculation-card";

export default function DashboardPage() {
    const router = useRouter();
    const { t, language } = useI18n();
    const { formatCurrency, format } = useNumberFormat();
    const [showQuickEntry, setShowQuickEntry] = useState(false);
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
        refetch: refetchTransactions
    } = useTransactions();

    const {
        data: contacts = [],
        isPending: contactsPending,
        error: contactsError,
        refetch: refetchContacts
    } = useSavedContacts();

    const handleRefresh = async () => {
        await Promise.all([refetchTransactions(), refetchContacts()]);
    };

    const handleQuickEntry = (data: { grossWeight: string; ratePerKg: string; sellerName?: string; buyerName?: string }) => {
        const grossWeight = parseFloat(data.grossWeight);
        const ratePerKg = parseFloat(data.ratePerKg);

        // Calculate using central logic
        const result = calculateTransaction({
            grossWeightKg: grossWeight,
            ratePerKg: ratePerKg,
            deductionMethod: "B", // Default to Method B as per requirements
            deductionPercent: 5,
            commissionPercent: 2
        });

        // Update current calculation for display
        setCurrentCalculation({
            grossWeight: result.grossWeightKg,
            ratePerKg: result.ratePerKg,
            netWeight: result.netWeightKg,
            baseAmount: result.baseAmount,
            finalAmount: result.finalAmount,
            sellerName: data.sellerName,
            buyerName: data.buyerName,
        });

        // Play success sound
        import('@/lib/sounds/sound-manager').then(({ soundManager }) => {
            soundManager.play('success');
        });

        // Show success message
        toast.success(t("dashboard.calculationComplete"));
    };

    const stats = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const todayTransactions = transactions.filter(
            (t: any) => new Date(t.created_at) >= today
        );
        const monthTransactions = transactions.filter(
            (t: any) => new Date(t.created_at) >= monthStart
        );
        const lastMonthTransactions = transactions.filter(
            (t: any) => {
                const date = new Date(t.created_at);
                return date >= lastMonthStart && date <= lastMonthEnd;
            }
        );

        const monthRevenue = monthTransactions.reduce((sum: number, t: any) => sum + (t.commission_amount || 0), 0);
        const lastMonthRevenue = lastMonthTransactions.reduce((sum: number, t: any) => sum + (t.commission_amount || 0), 0);
        const revenueChange = lastMonthRevenue > 0 ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

        const contactChange = ((contacts.length - Math.max(1, contacts.length - 5)) / Math.max(1, contacts.length - 5)) * 100;

        return {
            totalTransactions: transactions.length,
            todayRevenue: todayTransactions.reduce((sum: number, t: any) => sum + (t.commission_amount || 0), 0),
            totalContacts: contacts.length,
            monthlyRevenue: monthRevenue,
            revenueChange: Math.round(revenueChange),
            transactionChange: monthTransactions.length > 0 ? 12 : 0,
            contactChange: Math.round(contactChange),
        };
    }, [transactions, contacts]);

    const recentTransactions = useMemo(() => {
        return [...transactions]
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    }, [transactions]);

    // Get latest transaction for compact card
    const latestTransaction = useMemo(() => {
        return transactions.length > 0
            ? [...transactions].sort((a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
            : null;
    }, [transactions]);

    // Only show skeleton on INITIAL load when no data is available
    // Persistence will provide stale data immediately on reload/tab switch
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
                        <p className="text-red-500">Failed to load dashboard data</p>
                        <p className="text-sm text-muted-foreground">
                            {transactionsError instanceof Error ? transactionsError.message : ""}
                            {contactsError instanceof Error ? (transactionsError ? " | " : "") + contactsError.message : ""}
                            {!transactionsError && !contactsError ? "Unknown error" : ""}
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Mobile View - Scaled, No Scroll */}
            <div className="lg:hidden h-full">
                <MobileFitContainer headerHeight={80} bottomNavHeight={96}>
                    <div className="space-y-3 px-1 pt-0 pb-1">
                        <LatestCalculationCard
                            currentCalculation={currentCalculation}
                            latestTransaction={latestTransaction}
                        />
                        <QuickEntryCard onSubmit={handleQuickEntry} />
                    </div>
                </MobileFitContainer>
            </div>

            {/* Desktop Content - Hidden on Mobile */}
            <div className="hidden lg:block space-y-6">
                <LatestCalculationCard
                    currentCalculation={currentCalculation}
                    latestTransaction={latestTransaction}
                    className="mb-6"
                />

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title={t("dashboard.totalTransactions")}
                        value={stats.totalTransactions.toString()}
                        change={stats.transactionChange}
                        icon={Receipt}
                    />
                    <StatCard
                        title={t("dashboard.todaysRevenue")}
                        value={formatCurrency(stats.todayRevenue)}
                        change={stats.revenueChange}
                        icon={DollarSign}
                    />
                    <StatCard
                        title={t("dashboard.totalContacts")}
                        value={stats.totalContacts.toString()}
                        change={stats.contactChange}
                        icon={Users}
                    />
                    <StatCard
                        title={t("dashboard.monthlyRevenue")}
                        value={formatCurrency(stats.monthlyRevenue)}
                        change={stats.revenueChange}
                        icon={TrendingUp}
                    />
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold mb-4">{t("dashboard.quickActions")}</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <QuickAction
                            title={t("dashboard.quickActionNewTransaction")}
                            description={t("dashboard.quickActionNewTransactionDesc")}
                            icon={FileText}
                            onClick={() => setShowQuickEntry(true)}
                            gradient="from-blue-500 to-cyan-500"
                        />
                        <QuickAction
                            title={t("dashboard.quickActionAddContact")}
                            description={t("dashboard.quickActionAddContactDesc")}
                            icon={Users}
                            onClick={() => router.push("/contacts")}
                            gradient="from-purple-500 to-pink-500"
                        />
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{t("dashboard.recentTransactions")}</CardTitle>
                                    <CardDescription>{t("dashboard.latestActivity")}</CardDescription>
                                </div>
                                {transactions.length > 0 && (
                                    <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                                        <Link href="/transactions">
                                            {t("dashboard.viewAllTransactions")}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentTransactions.length > 0 ? (
                                <div className="space-y-4">
                                    {recentTransactions.map((transaction: any) => (
                                        <ActivityItem
                                            key={transaction.id}
                                            title={transaction.fish_type || "Transaction"}
                                            description={`${format(transaction.gross_weight)}kg • ${formatCurrency(transaction.commission_amount)}`}
                                            time={formatDistanceToNow(new Date(transaction.created_at), language)}
                                            avatar={
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Receipt className="h-5 w-5 text-primary" />
                                                </div>
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    type="no-data"
                                    title={t("transactions.noTransactions")}
                                    description={t("dashboard.quickActionNewTransactionDesc")}
                                    actionLabel={t("dashboard.newTransaction")}
                                    actionHref="/transactions/new"
                                />
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
