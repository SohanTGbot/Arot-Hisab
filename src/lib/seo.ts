import { Metadata } from "next";

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    noindex?: boolean;
    keywords?: string[];
}

export function generateMetadata({
    title,
    description,
    canonical,
    ogImage = "/og-image.png",
    noindex = false,
    keywords = [],
}: SEOProps): Metadata {
    const siteName = "Arot Hisab";
    const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arot-hisab.com";
    const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;
    const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;

    return {
        title: fullTitle,
        description,
        keywords: [
            "fish market calculator",
            "আরত হিসাব",
            "wholesale calculator",
            "market calculation",
            ...keywords,
        ],
        authors: [{ name: "Arot Hisab Team" }],
        creator: "Arot Hisab",
        publisher: "Arot Hisab",
        robots: noindex
            ? { index: false, follow: false }
            : { index: true, follow: true },
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: "website",
            locale: "en_US",
            alternateLocale: ["bn_BD"],
            url: canonicalUrl,
            title: fullTitle,
            description,
            siteName,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [ogImageUrl],
            creator: "@arothisab",
        },
        viewport: {
            width: "device-width",
            initialScale: 1,
            maximumScale: 5,
        },
        manifest: "/manifest.json",
        icons: {
            icon: [
                { url: "/favicon.ico" },
                { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
                { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
            ],
            apple: [
                { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
            ],
        },
        appleWebApp: {
            capable: true,
            statusBarStyle: "default",
            title: siteName,
        },
    };
}

// JSON-LD Schema for organization
export function getOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Arot Hisab",
        description: "Automated calculation platform for fish wholesale markets",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://arot-hisab.com",
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://arot-hisab.com"}/logo.png`,
        sameAs: [],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Support",
            email: "support@arot-hisab.com",
        },
    };
}

// JSON-LD Schema for software application
export function getSoftwareApplicationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Arot Hisab",
        description: "Specialized calculator for fish wholesale markets in West Bengal",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "150",
        },
    };
}

// Breadcrumb schema
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
