"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error Boundary Caught:", error, errorInfo);

        // Log to error tracking service (e.g., Sentry) if available
        if (typeof window !== "undefined" && (window as any).Sentry) {
            (window as any).Sentry.captureException(error, { extra: errorInfo });
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <Card className="max-w-lg w-full glass-card border-destructive/50">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 rounded-full bg-destructive/10">
                                    <AlertTriangle className="h-6 w-6 text-destructive" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Something went wrong</CardTitle>
                                    <CardDescription>
                                        We encountered an unexpected error
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {process.env.NODE_ENV === "development" && this.state.error && (
                                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <p className="text-sm font-mono text-destructive">
                                        {this.state.error.message}
                                    </p>
                                    {this.state.error.stack && (
                                        <details className="mt-2">
                                            <summary className="text-xs text-muted-foreground cursor-pointer">
                                                Stack trace
                                            </summary>
                                            <pre className="mt-2 text-xs overflow-auto max-h-40">
                                                {this.state.error.stack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={this.handleReset}
                                    className="flex-1"
                                    variant="default"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Link href="/">
                                        <Home className="h-4 w-4 mr-2" />
                                        Go Home
                                    </Link>
                                </Button>
                            </div>

                            <p className="text-xs text-center text-muted-foreground">
                                If this problem persists, please{" "}
                                <Link href="/contact" className="underline hover:text-foreground">
                                    contact support
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
