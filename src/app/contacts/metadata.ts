import { generateMetadata as createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
    title: "Contacts",
    description: "Manage your saved buyer and seller contacts for quick access.",
    canonical: "/contacts",
    noindex: true,
});
