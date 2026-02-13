"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuditLogs } from "@/hooks/admin/use-admin";

export default function AdminAuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data: result, isLoading } = useAuditLogs(page, limit);
    const logs = result?.data || [];
    const metadata = result?.metadata;

    const getActionColor = (action: string) => {
        switch (action) {
            case "ban_user":
            case "unban_user":
                return "text-orange-500";
            case "delete_transaction":
                return "text-destructive";
            case "update_settings":
                return "text-blue-500";
            default:
                return "text-muted-foreground";
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground">
                        Track all administrative actions
                    </p>
                </div>

                <Card glass>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <div>
                                <CardTitle>System Audit Trail</CardTitle>
                                <CardDescription>Complete history of admin actions</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search logs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {logs.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Timestamp</TableHead>
                                            <TableHead>Admin</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Target</TableHead>
                                            <TableHead>Details</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="text-sm">
                                                    {formatDate(log.created_at)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {(log.users as any)?.email || "Unknown"}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                                                        {log.action.replace(/_/g, " ").toUpperCase()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {log.target_user_id || "N/A"}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                                    {log.details ? JSON.stringify(log.details) : "—"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p>No audit logs found</p>
                                <p className="text-sm mt-2">Admin actions will appear here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination - Simple implementation */}
                {metadata && metadata.totalPages > 1 && (
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1">
                            Page {page} of {metadata.totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
                            disabled={page === metadata.totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
