"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: LucideIcon;
    iconColor?: string;
    trend?: "up" | "down";
    subtitle?: string;
}

import { useNumberFormat } from "@/hooks/use-number-format";

export function StatCard({
    title,
    value,
    change,
    icon: Icon,
    iconColor = "text-primary",
    trend,
    subtitle,
}: StatCardProps) {
    const changeColor = trend === "up" ? "text-green-600 dark:text-green-400" : trend === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground";
    const { format } = useNumberFormat();

    const formattedValue = typeof value === 'number' ? format(value) : format(value);
    const formattedChange = change !== undefined ? format(change) : undefined;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
        >
            <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="absolute top-0 right-0 p-3 opacity-5">
                    <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
                </div>

                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <div className={`p-2.5 rounded-xl bg-primary/10 shadow-inner ${iconColor}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {formattedValue}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        {change !== undefined && (
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-background/50 border border-border/50 ${changeColor}`}>
                                {change > 0 ? "+" : ""}{formattedChange}%
                            </span>
                        )}
                        {subtitle && (
                            <span className="text-xs text-muted-foreground">{subtitle}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

interface QuickActionProps {
    title: string;
    description: string;
    icon: LucideIcon;
    onClick: () => void;
    gradient?: string;
}

export function QuickAction({
    title,
    description,
    icon: Icon,
    onClick,
    gradient = "from-blue-500 to-cyan-500",
}: QuickActionProps) {
    return (
        <motion.button
            onClick={onClick}
            className="w-full text-left group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors duration-300">
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg shadow-current/20 group-hover:shadow-current/40 transition-shadow duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg group-hover:text-primary transition-colors">{title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{description}</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                        {/* Chevron or Arrow could go here */}
                    </div>
                </CardContent>
            </Card>
        </motion.button>
    );
}

interface ActivityItemProps {
    avatar?: ReactNode;
    title: string;
    description: string;
    time: string;
    badge?: ReactNode;
}

export function ActivityItem({
    avatar,
    title,
    description,
    time,
    badge,
}: ActivityItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-4 py-3 hover:bg-accent/50 px-2 rounded-lg transition-colors"
        >
            {avatar && (
                <div className="flex-shrink-0">{avatar}</div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{title}</p>
                    {badge}
                </div>
                <p className="text-sm text-muted-foreground truncate">{description}</p>
                <p className="text-xs text-muted-foreground mt-1">{time}</p>
            </div>
        </motion.div>
    );
}
