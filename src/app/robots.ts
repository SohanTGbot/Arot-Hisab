import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arot-hisab.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/admin/",
                    "/dashboard/",
                    "/profile/",
                    "/settings/",
                    "/transactions/",
                    "/contacts/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
