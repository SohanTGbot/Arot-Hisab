import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arot-hisab.com";

    const currentDate = new Date();

    return [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/features`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/donate`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/feedback`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/help`,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.4,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.4,
        },
        {
            url: `${baseUrl}/auth/signin`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/auth/signup`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.7,
        },
    ];
}
