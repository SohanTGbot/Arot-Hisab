import { generateMetadata as createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
    title: "Dashboard",
    description: "View your transaction overview, statistics, and quick actions for fish market operations.",
    canonical: "/dashboard",
    noindex: true,
});
