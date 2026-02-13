import { generateMetadata as createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
    title: "Settings",
    description: "Configure your application preferences and defaults.",
    canonical: "/settings",
    noindex: true,
});
