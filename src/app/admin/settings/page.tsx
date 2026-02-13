"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Database, Bell, Shield } from "lucide-react";
import { toast } from "sonner";

import { useSystemSettings, useUpdateSetting } from "@/hooks/admin/use-admin";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const { data: settings, isLoading } = useSystemSettings();
    const updateSetting = useUpdateSetting();

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-muted-foreground">Loading settings...</div>
                </div>
            </DashboardLayout>
        );
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            // Update settings one by one or batch if API supported batch
            // For now, we'll update individual fields based on form data
            const updates = [
                { key: 'app_name', value: formData.get('appName') },
                { key: 'support_email', value: formData.get('supportEmail') },
                { key: 'maintenance_mode', value: formData.get('maintenanceMode') === 'on' },
                { key: 'transaction_retention_days', value: Number(formData.get('transactionRetention')) },
                { key: 'audit_log_retention_days', value: Number(formData.get('auditLogRetention')) },
                { key: 'email_notifications', value: formData.get('emailNotifications') === 'on' },
                { key: 'admin_alerts', value: formData.get('adminAlerts') === 'on' },
                { key: 'session_timeout_minutes', value: Number(formData.get('sessionTimeout')) },
                { key: 'require_email_verification', value: formData.get('requireEmailVerification') === 'on' },
                { key: 'two_factor_auth', value: formData.get('twoFactorAuth') === 'on' },
            ];

            await Promise.all(updates.map(update =>
                updateSetting.mutateAsync({ key: update.key, value: update.value })
            ));

            toast.success("Settings saved successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground">
                        Configure application-wide settings
                    </p>
                </div>

                <form onSubmit={handleSave} className="grid gap-6 max-w-4xl">
                    <Card glass>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                General Settings
                            </CardTitle>
                            <CardDescription>Basic application configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="appName">Application Name</Label>
                                <Input
                                    id="appName"
                                    name="appName"
                                    defaultValue={settings?.app_name || "Arot Hisab"}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="supportEmail">Support Email</Label>
                                <Input
                                    id="supportEmail"
                                    name="supportEmail"
                                    type="email"
                                    defaultValue={settings?.support_email || ""}
                                    placeholder="support@arothisab.com"
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Maintenance Mode</p>
                                    <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    className="h-4 w-4"
                                    defaultChecked={settings?.maintenance_mode}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Data Retention
                            </CardTitle>
                            <CardDescription>Configure data retention policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="transactionRetention">Transaction Retention (days)</Label>
                                <Input
                                    id="transactionRetention"
                                    name="transactionRetention"
                                    type="number"
                                    defaultValue={settings?.transaction_retention_days || 365}
                                    className="mt-2"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Transactions older than this will be archived
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="auditLogRetention">Audit Log Retention (days)</Label>
                                <Input
                                    id="auditLogRetention"
                                    name="auditLogRetention"
                                    type="number"
                                    defaultValue={settings?.audit_log_retention_days || 90}
                                    className="mt-2"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                            <CardDescription>System notification settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">Send system emails to users</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    className="h-4 w-4"
                                    defaultChecked={settings?.email_notifications !== false}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Admin Alerts</p>
                                    <p className="text-sm text-muted-foreground">Notify admins of critical events</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="adminAlerts"
                                    className="h-4 w-4"
                                    defaultChecked={settings?.admin_alerts !== false}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security
                            </CardTitle>
                            <CardDescription>Security and access control</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                <Input
                                    id="sessionTimeout"
                                    name="sessionTimeout"
                                    type="number"
                                    defaultValue={settings?.session_timeout_minutes || 60}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Require Email Verification</p>
                                    <p className="text-sm text-muted-foreground">Users must verify email to access</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="requireEmailVerification"
                                    className="h-4 w-4"
                                    defaultChecked={settings?.require_email_verification !== false}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Two-Factor Authentication</p>
                                    <p className="text-sm text-muted-foreground">Enable 2FA for all users</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="twoFactorAuth"
                                    className="h-4 w-4"
                                    defaultChecked={settings?.two_factor_auth}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => window.location.reload()}>Reset Defaults</Button>
                        <Button type="submit" loading={loading}>
                            Save Settings
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
