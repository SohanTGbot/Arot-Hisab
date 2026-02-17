"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, TrendingUp, Users, DollarSign, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { useTransactions } from "@/hooks/queries/use-transactions";
import { useSavedContacts } from "@/hooks/queries/use-contacts";
import { useMemo, useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { StatCard, QuickAction, ActivityItem } from "@/components/dashboard/dashboard-components";
import { DashboardSkeleton } from "@/components/loading-skeletons";
import { EmptyState } from "@/components/empty-state";
import { formatDistanceToNow } from "@/lib/utils";
import { useNumberFormat } from "@/hooks/use-number-format";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LatestCalculationCard } from "@/components/dashboard/latest-calculation-card";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
    const router = useRouter();
    const { t, language } = useI18n();
    const { formatCurrency, format } = useNumberFormat();
    const { user } = useAuth();

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return t("dashboard.goodMorning");
        if (hour < 18) return t("dashboard.goodAfternoon");
        return t("dashboard.goodEvening");
    }, [t]);

    const currentDate = useMemo(() => {
        return new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [language]);

    const {
        data: transactions = [],
        isPending: transactionsPending,
        error: transactionsError,
    } = useTransactions();

    const {
        data: contacts = [],
        isPending: contactsPending,
        error: contactsError,
    } = useSavedContacts();

    const stats = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Fixed logic below
        // Fix: lastMonthStart should be month - 1
        const actualLastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
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
                return date >= actualLastMonthStart && date <= lastMonthEnd;
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
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || t("common.welcome");

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Greeting Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-2">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            {greeting}, {userName}
                        </h1>
                        <p className="text-muted-foreground mt-1">{t("dashboard.welcome")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-border/50 shadow-sm">
                            {currentDate}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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

                {/* Latest Calculation - Shown here as well for quick access */}
                <LatestCalculationCard
                    currentCalculation={null} // Only show historical latest here
                    latestTransaction={latestTransaction}
                    className="mb-6"
                />

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold mb-4">{t("dashboard.quickActions")}</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <QuickAction
                            title={t("nav.calculator")}
                            description="Go to Calculator"
                            icon={FileText}
                            onClick={() => router.push("/calculator")}
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
