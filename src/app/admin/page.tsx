"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Receipt, DollarSign, MessageSquare, Activity, AlertCircle, TrendingUp } from "lucide-react";
import { useAdminStats } from "@/hooks/admin/use-admin";

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useAdminStats();

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        System overview and management
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card glass>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.totalUsers || 0} total registered
                            </p>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalTransactions || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                All time
                            </p>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
                            <p className="text-xs text-muted-foreground">
                                Commission earned
                            </p>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Feedback</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{0}</div>
                            <p className="text-xs text-muted-foreground">
                                Requires attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{0}</div>
                            <p className="text-xs text-muted-foreground">
                                Active issues
                            </p>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0%</div>
                            <p className="text-xs text-muted-foreground">
                                Month over month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card glass>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest system events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No recent activity</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader>
                            <CardTitle>System Health</CardTitle>
                            <CardDescription>Service status overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Database</span>
                                    <span className="text-sm text-green-500 font-medium">Operational</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Authentication</span>
                                    <span className="text-sm text-green-500 font-medium">Operational</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Storage</span>
                                    <span className="text-sm text-green-500 font-medium">Operational</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">API</span>
                                    <span className="text-sm text-green-500 font-medium">Operational</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
