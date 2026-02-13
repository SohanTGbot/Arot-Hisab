"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Ban, CheckCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { useAdminUsers, useAdminUserBan } from "@/hooks/admin/use-admin";

export default function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data, isLoading } = useAdminUsers(page, limit, searchQuery);
    const banUser = useAdminUserBan();

    const users = data?.data || [];

    const handleBanToggle = async (userId: string, currentlyBanned: boolean) => {
        const action = currentlyBanned ? "unban" : "ban";
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await banUser.mutateAsync({ userId, shouldBan: !currentlyBanned });
                toast.success(`User ${action}ned successfully`);
            } catch (error: any) {
                toast.error(error.message || `Failed to ${action} user`);
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage user accounts and permissions
                    </p>
                </div>

                <Card glass>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div>
                                <CardTitle>All Users</CardTitle>
                                <CardDescription>View and manage registered users</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Loading users...</p>
                            </div>
                        ) : users.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user: any) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {user.user_metadata?.full_name || "N/A"}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell className="capitalize">
                                                    {user.user_metadata?.role || "user"}
                                                </TableCell>
                                                <TableCell>{formatDate(user.created_at)}</TableCell>
                                                <TableCell>
                                                    {user.banned_until ? (
                                                        <span className="text-destructive text-sm font-medium">Banned</span>
                                                    ) : (
                                                        <span className="text-green-500 text-sm font-medium">Active</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleBanToggle(user.id, !!user.banned_until)}
                                                        >
                                                            {user.banned_until ? (
                                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <Ban className="h-4 w-4 text-destructive" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No users found</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
