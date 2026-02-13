// Performance monitoring utilities

export function measurePerformance(label: string, fn: () => void) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
}

export async function measureAsyncPerformance(
    label: string,
    fn: () => Promise<void>
) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
}

// Lazy load images with Intersection Observer
export function lazyLoadImage(img: HTMLImageElement) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const image = entry.target as HTMLImageElement;
                    const src = image.dataset.src;
                    if (src) {
                        image.src = src;
                        image.removeAttribute("data-src");
                    }
                    observer.unobserve(image);
                }
            });
        },
        { rootMargin: "50px" }
    );

    observer.observe(img);
}

// Preload critical resources
export function preloadResources(urls: string[], type: "image" | "script" | "style") {
    urls.forEach((url) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = url;

        switch (type) {
            case "image":
                link.as = "image";
                break;
            case "script":
                link.as = "script";
                break;
            case "style":
                link.as = "style";
                break;
        }

        document.head.appendChild(link);
    });
}

// Report Web Vitals
export function reportWebVitals(metric: any) {
    // Send to analytics
    if (process.env.NODE_ENV === "production") {
        console.log(metric);
        // Example: Send to Google Analytics
        // window.gtag?.("event", metric.name, {...});
    }
}

// Memory leak detector
export function detectMemoryLeaks() {
    if (typeof performance.memory !== "undefined") {
        const memory = (performance as any).memory;
        return {
            usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2),
            totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2),
            jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2),
        };
    }
    return null;
}
