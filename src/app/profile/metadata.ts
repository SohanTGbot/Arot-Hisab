import { generateMetadata as createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
    title: "Profile",
    description: "Manage your account information and preferences.",
    canonical: "/profile",
    noindex: true,
});
