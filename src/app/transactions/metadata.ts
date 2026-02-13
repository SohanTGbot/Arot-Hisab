import { generateMetadata as createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
    title: "Transactions",
    description: "Manage and view all your fish wholesale transaction records.",
    canonical: "/transactions",
    noindex: true,
});
