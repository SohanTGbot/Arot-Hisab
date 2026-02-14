"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Plus, Download, Filter, Eye } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useTransactions } from "@/hooks/queries/use-transactions";
import { useNumberFormat } from "@/hooks/use-number-format";
import { TableSkeleton } from "@/components/loading-skeletons";
import { EmptyState } from "@/components/empty-state";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/provider";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TransactionsPage() {
    const { formatCurrency, format } = useNumberFormat();
    const { language } = useI18n();
    const [searchQuery, setSearchQuery] = useState("");
    const { data: allTransactions = [], isLoading } = useTransactions();

    const transactions = useMemo(() => {
        if (!searchQuery) return allTransactions;
        const query = searchQuery.toLowerCase();
        return allTransactions.filter(
            (t: any) =>
                t.buyer_name?.toLowerCase().includes(query) ||
                t.seller_name?.toLowerCase().includes(query) ||
                t.fish_type?.toLowerCase().includes(query) ||
                t.notes?.toLowerCase().includes(query)
        );
    }, [allTransactions, searchQuery]);

    const totalRevenue = useMemo(() => {
        return transactions.reduce((sum: number, t: any) => sum + (t.commission_amount || 0), 0);
    }, [transactions]);

    if (isLoading && allTransactions.length === 0) {
        return (
            <DashboardLayout>
                <TableSkeleton />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                        <p className="text-muted-foreground">
                            Manage your fish wholesale transactions
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => exportToPDF(transactions as any[], "Transaction Report", language)}>
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => exportToExcel(transactions as any[], "transactions", language)}>
                                    Export as Excel
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button asChild>
                            <Link href="/transactions/new">
                                <Plus className="mr-2 h-4 w-4" />
                                New Transaction
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid gap-4 md:grid-cols-3"
                >
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground">Total Transactions</div>
                        <div className="text-2xl font-bold">{format(transactions.length)}</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(totalRevenue)}
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground">Average Commission</div>
                        <div className="text-2xl font-bold">
                            {transactions.length > 0
                                ? formatCurrency(totalRevenue / transactions.length)
                                : formatCurrency(0)}
                        </div>
                    </Card>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </motion.div>

                {/* Transactions Table */}
                {transactions.length === 0 ? (
                    <EmptyState
                        type={searchQuery ? "no-results" : "no-transactions"}
                        actionHref={searchQuery ? undefined : "/transactions/new"}
                        onAction={searchQuery ? () => setSearchQuery("") : undefined}
                        actionLabel={searchQuery ? "Clear Search" : undefined}
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Buyer</TableHead>
                                        <TableHead>Seller</TableHead>
                                        <TableHead>Fish Type</TableHead>
                                        <TableHead className="text-right">Weight</TableHead>
                                        <TableHead className="text-right">Rate</TableHead>
                                        <TableHead className="text-right">Commission</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction: any, index: number) => (
                                        <motion.tr
                                            key={transaction.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-accent/50 transition-colors"
                                        >
                                            <TableCell className="font-medium">
                                                {formatDate(transaction.created_at, language === 'bn' ? 'bn-BD' : 'en-IN')}
                                            </TableCell>
                                            <TableCell>{transaction.buyer_name}</TableCell>
                                            <TableCell>{transaction.seller_name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{transaction.fish_type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {format(transaction.total_weight.toFixed(3))} kg
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(transaction.rate)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">
                                                {formatCurrency(transaction.commission_amount || 0)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/transactions/${transaction.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
