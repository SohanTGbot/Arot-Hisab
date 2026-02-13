import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function PageSkeleton() {
    return (
        <div className="container px-4 py-8 space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-6 space-y-3">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full" />
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="border rounded-lg">
                <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted/50">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-4" />
                    ))}
                </div>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0">
                        {Array.from({ length: 4 }).map((_, j) => (
                            <Skeleton key={j} className="h-4" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </Card>
    );
}

export function FormSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
            <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                        <Skeleton className="h-8 w-20 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </Card>
                ))}
            </div>

            {/* Chart Skeleton */}
            <Card className="p-6">
                <Skeleton className="h-6 w-48 mb-6" />
                <Skeleton className="h-64 w-full" />
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
