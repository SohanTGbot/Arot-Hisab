"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>

            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                <p className="text-lg text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            <Card className="glass-card">
                <CardContent className="p-8 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
                        <p className="leading-relaxed">
                            By accessing or using Arot Hisab, you agree to be bound by these Terms of Service and our Privacy Policy.
                            If you disagree with any part of the terms, then you may not access the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">2. Use License</h2>
                        <p className="leading-relaxed">
                            Permission is granted to temporarily access the materials (information or software) on Arot Hisab's website for personal, non-commercial transitory viewing only.
                            This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>attempt to decompile or reverse engineer any software contained on Arot Hisab's website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">3. Disclaimer</h2>
                        <p className="leading-relaxed">
                            The materials on Arot Hisab's website are provided on an 'as is' basis. Arot Hisab makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">4. Limitations</h2>
                        <p className="leading-relaxed">
                            In no event shall Arot Hisab or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Arot Hisab's website, even if Arot Hisab or a Arot Hisab authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">5. Accuracy of Materials</h2>
                        <p className="leading-relaxed">
                            The materials appearing on Arot Hisab's website could include technical, typographical, or photographic errors. Arot Hisab does not warrant that any of the materials on its website are accurate, complete or current. Arot Hisab may make changes to the materials contained on its website at any time without notice. However Arot Hisab does not make any commitment to update the materials.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">6. Governing Law</h2>
                        <p className="leading-relaxed">
                            These terms and conditions are governed by and construed in accordance with the laws of Bangladesh and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
