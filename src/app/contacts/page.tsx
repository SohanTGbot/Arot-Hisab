"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, User, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useSavedContacts, useCreateSavedContact, useUpdateSavedContact, useDeleteSavedContact } from "@/hooks/queries/use-contacts";
import { EmptyState } from "@/components/empty-state";
import { CardSkeleton } from "@/components/loading-skeletons";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { useNumberFormat } from "@/hooks/use-number-format";

export default function ContactsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", phone: "", type: "buyer", notes: "" });
    const { t } = useI18n();
    const { format } = useNumberFormat();

    const { data: allContacts = [], isLoading } = useSavedContacts();
    const createContact = useCreateSavedContact();
    const updateContact = useUpdateSavedContact();
    const deleteContact = useDeleteSavedContact();

    const contacts = useMemo(() => {
        if (!searchQuery) return allContacts;
        const query = searchQuery.toLowerCase();
        return allContacts.filter((c: any) =>
            c.name?.toLowerCase().includes(query) ||
            c.phone?.toLowerCase().includes(query)
        );
    }, [allContacts, searchQuery]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingContact) {
                await updateContact.mutateAsync({
                    id: editingContact.id,
                    updates: formData
                });
                toast.success(t("notifications.contactUpdated"));
            } else {
                await createContact.mutateAsync(formData);
                toast.success(t("notifications.contactAdded"));
            }
            setIsDialogOpen(false);
            setEditingContact(null);
            setFormData({ name: "", phone: "", type: "buyer", notes: "" });
        } catch (error: any) {
            toast.error(error.message || t("notifications.contactSaveError"));
        }
    };

    const handleEdit = (contact: any) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            phone: contact.phone || "",
            type: contact.type,
            notes: contact.notes || ""
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this contact?")) {
            try {
                await deleteContact.mutateAsync(id);
                toast.success(t("notifications.contactDeleted"));
            } catch (error: any) {
                toast.error(error.message || t("notifications.contactDeleteError"));
            }
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                            <p className="text-muted-foreground">Manage your saved contacts</p>
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                </div>
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
                        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                        <p className="text-muted-foreground">
                            Manage your saved buyer and seller contacts
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                setEditingContact(null);
                                setFormData({ name: "", phone: "", type: "buyer", notes: "" });
                            }}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Contact
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
                                <DialogDescription>
                                    {editingContact ? "Update contact information" : "Save a new buyer or seller contact"}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSave}>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="type">Type *</Label>
                                        <select
                                            id="type"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                                            required
                                        >
                                            <option value="buyer">Buyer</option>
                                            <option value="seller">Seller</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <Input
                                            id="notes"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="mt-6">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={createContact.isPending || updateContact.isPending}>
                                        {createContact.isPending || updateContact.isPending ? "Saving..." : "Save"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid gap-4 md:grid-cols-3"
                >
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground">Total Contacts</div>
                        <div className="text-2xl font-bold">{format(allContacts.length)}</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground">Buyers</div>
                        <div className="text-2xl font-bold">
                            {format(allContacts.filter((c: any) => c.type === "buyer" || c.type === "both").length)}
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground">Sellers</div>
                        <div className="text-2xl font-bold">
                            {format(allContacts.filter((c: any) => c.type === "seller" || c.type === "both").length)}
                        </div>
                    </Card>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </motion.div>

                {/* Contacts Grid */}
                {contacts.length === 0 ? (
                    <EmptyState
                        type={searchQuery ? "no-results" : "no-contacts"}
                        actionHref={searchQuery ? undefined : undefined}
                        onAction={searchQuery ? () => setSearchQuery("") : () => {
                            setEditingContact(null);
                            setFormData({ name: "", phone: "", type: "buyer", notes: "" });
                            setIsDialogOpen(true);
                        }}
                        actionLabel={searchQuery ? "Clear Search" : "Add Contact"}
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {contacts.map((contact: any, index: number) => (
                            <motion.div
                                key={contact.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                                                    <Badge variant={contact.type === "buyer" ? "default" : contact.type === "seller" ? "secondary" : "outline"}>
                                                        {contact.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {contact.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="h-4 w-4" />
                                                {contact.phone}
                                            </div>
                                        )}
                                        {contact.notes && (
                                            <p className="text-sm text-muted-foreground">{contact.notes}</p>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(contact)}
                                                className="flex-1"
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(contact.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
