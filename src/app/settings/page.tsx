"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Globe, Type, Calculator, Save } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/provider";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { language, setLanguage } = useI18n();
    const [settings, setSettings] = useState({
        defaultMethod: "A",
        defaultDeduction: 5,
        defaultCommission: 2,
        fontSize: "medium",
        emailNotifications: true,
        transactionReminders: true,
    });

    const handleSave = () => {
        // Save settings to localStorage or backend
        localStorage.setItem("app_settings", JSON.stringify(settings));
        toast.success("Settings saved successfully!");
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your application preferences
                    </p>
                </motion.div>

                <div className="grid gap-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Language & Region
                                </CardTitle>
                                <CardDescription>Choose your preferred language</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="language">Display Language</Label>
                                    <select
                                        id="language"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value as "en" | "bn")}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                                    >
                                        <option value="en">English</option>
                                        <option value="bn">বাংলা (Bengali)</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    Calculation Defaults
                                </CardTitle>
                                <CardDescription>Set default values for transactions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="defaultMethod">Default Calculation Method</Label>
                                    <select
                                        id="defaultMethod"
                                        value={settings.defaultMethod}
                                        onChange={(e) => setSettings({ ...settings, defaultMethod: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                                    >
                                        <option value="A">Method A (Net = Gross × 0.95)</option>
                                        <option value="B">Method B (Net = (Kg × 0.95) + Grams)</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="defaultDeduction">Default Deduction (%)</Label>
                                    <input
                                        type="number"
                                        id="defaultDeduction"
                                        value={settings.defaultDeduction}
                                        onChange={(e) => setSettings({ ...settings, defaultDeduction: Number(e.target.value) })}
                                        step="0.1"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="defaultCommission">Default Commission (%)</Label>
                                    <input
                                        type="number"
                                        id="defaultCommission"
                                        value={settings.defaultCommission}
                                        onChange={(e) => setSettings({ ...settings, defaultCommission: Number(e.target.value) })}
                                        step="0.1"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Type className="h-5 w-5" />
                                    Display Preferences
                                </CardTitle>
                                <CardDescription>Customize how information is displayed</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="fontSize">Font Size</Label>
                                    <select
                                        id="fontSize"
                                        value={settings.fontSize}
                                        onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                                    >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notifications
                                </CardTitle>
                                <CardDescription>Manage notification preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                                    </div>
                                    <Switch
                                        checked={settings.emailNotifications}
                                        onCheckedChange={(checked) =>
                                            setSettings({ ...settings, emailNotifications: checked })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Transaction Reminders</p>
                                        <p className="text-sm text-muted-foreground">Daily summary notifications</p>
                                    </div>
                                    <Switch
                                        checked={settings.transactionReminders}
                                        onCheckedChange={(checked) =>
                                            setSettings({ ...settings, transactionReminders: checked })
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-end"
                    >
                        <Button onClick={handleSave} size="lg">
                            <Save className="h-4 w-4 mr-2" />
                            Save Settings
                        </Button>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
