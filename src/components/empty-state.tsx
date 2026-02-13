import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileX, Inbox, Search, FileQuestion, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type EmptyStateType = "no-data" | "no-results" | "not-found" | "no-transactions" | "no-contacts" | "coming-soon";

interface EmptyStateProps {
    type?: EmptyStateType;
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

const emptyStateConfig = {
    "no-data": {
        icon: Inbox,
        title: "No data yet",
        description: "Get started by adding your first item",
        actionLabel: "Add Item",
        gradient: "from-blue-500 to-cyan-500",
    },
    "no-results": {
        icon: Search,
        title: "No results found",
        description: "Try adjusting your search or filter criteria",
        actionLabel: "Clear Filters",
        gradient: "from-purple-500 to-pink-500",
    },
    "not-found": {
        icon: FileQuestion,
        title: "Page not found",
        description: "The page you're looking for doesn't exist",
        actionLabel: "Go Home",
        gradient: "from-orange-500 to-red-500",
    },
    "no-transactions": {
        icon: TrendingUp,
        title: "No transactions yet",
        description: "Start by creating your first transaction",
        actionLabel: "New Transaction",
        gradient: "from-green-500 to-emerald-500",
    },
    "no-contacts": {
        icon: Users,
        title: "No contacts saved",
        description: "Save frequently used buyer and seller contacts",
        actionLabel: "Add Contact",
        gradient: "from-indigo-500 to-blue-500",
    },
    "coming-soon": {
        icon: FileX,
        title: "Coming Soon",
        description: "This feature is currently under development",
        actionLabel: "Back",
        gradient: "from-yellow-500 to-orange-500",
    },
};

export function EmptyState({
    type = "no-data",
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    const config = emptyStateConfig[type];
    const Icon = config.icon;

    const finalTitle = title || config.title;
    const finalDescription = description || config.description;
    const finalActionLabel = actionLabel || config.actionLabel;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center min-h-[400px] p-8"
        >
            <Card className="max-w-md w-full text-center glass-card">
                <CardHeader className="pb-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto mb-4"
                    >
                        <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${config.gradient}`}>
                            <Icon className="h-8 w-8 text-white" />
                        </div>
                    </motion.div>
                    <CardTitle className="text-2xl">{finalTitle}</CardTitle>
                    <CardDescription className="text-base">
                        {finalDescription}
                    </CardDescription>
                </CardHeader>
                {(actionHref || onAction) && (
                    <CardContent>
                        {actionHref ? (
                            <Button asChild size="lg" className="w-full sm:w-auto">
                                <Link href={actionHref}>{finalActionLabel}</Link>
                            </Button>
                        ) : (
                            <Button onClick={onAction} size="lg" className="w-full sm:w-auto">
                                {finalActionLabel}
                            </Button>
                        )}
                    </CardContent>
                )}
            </Card>
        </motion.div>
    );
}
