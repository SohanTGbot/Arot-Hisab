"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, CreditCard, Building2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/provider";

import { processDonation } from "@/lib/actions/donate";

export default function DonatePage() {
    const [amount, setAmount] = useState("");
    const [donorName, setDonorName] = useState("");
    const [message, setMessage] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("bkash");
    const [loading, setLoading] = useState(false);
    const { t } = useI18n();

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await processDonation({
                amount: parseFloat(amount),
                paymentMethod,
                message,
                donorName: isAnonymous ? undefined : donorName,
                isAnonymous
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Thank you for your donation!");
            setAmount("");
            setDonorName("");
            setMessage("");
        } catch (error: any) {
            toast.error("Failed to process donation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="text-center">
                    <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h1 className="text-3xl font-bold tracking-tight">Support Arot Hisab</h1>
                    <p className="text-muted-foreground mt-2">
                        Help us keep this service free for everyone
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                    <Card glass>
                        <CardHeader>
                            <CardTitle>Make a Donation</CardTitle>
                            <CardDescription>Every contribution helps us improve</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleDonate} className="space-y-4">
                                <div>
                                    <Label htmlFor="amount">Amount (₹)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="100"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="donorName">Your Name</Label>
                                    <Input
                                        id="donorName"
                                        value={donorName}
                                        onChange={(e) => setDonorName(e.target.value)}
                                        placeholder="John Doe"
                                        disabled={isAnonymous}
                                        required={!isAnonymous}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="anonymous"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="anonymous" className="cursor-pointer">
                                        Donate anonymously
                                    </Label>
                                </div>

                                <div>
                                    <Label htmlFor="message">Message (Optional)</Label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Leave a message of support..."
                                    />
                                </div>

                                <div>
                                    <Label>Payment Method</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {[
                                            { id: "bkash", label: "bKash", icon: Wallet },
                                            { id: "nagad", label: "Nagad", icon: CreditCard },
                                            { id: "bank", label: "Bank", icon: Building2 },
                                            { id: "cash", label: "Cash", icon: Wallet },
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${paymentMethod === method.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                <method.icon className="h-4 w-4" />
                                                <span className="text-sm font-medium">{method.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" loading={loading}>
                                    <Heart className="mr-2 h-4 w-4" />
                                    Donate Now
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card glass>
                        <CardHeader>
                            <CardTitle>Recent Donations</CardTitle>
                            <CardDescription>Thank you to our supporters</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No donations yet</p>
                                    <p className="text-sm mt-2">Be the first to support us!</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
