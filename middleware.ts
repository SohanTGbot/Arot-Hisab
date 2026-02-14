
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { rateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
    try {
        // Rate Limiting for API routes
        if (request.nextUrl.pathname.startsWith('/api')) {
            const ip = request.headers.get('x-forwarded-for') || 'ip';
            const isAllowed = await rateLimit(ip);

            if (!isAllowed) {
                return new NextResponse('Too Many Requests', { status: 429 });
            }
        }

        return await updateSession(request);
    } catch (e) {
        console.error("Middleware Error:", e);
        return new NextResponse(
            `Internal Server Error: ${e instanceof Error ? e.message : String(e)}`,
            { status: 500 }
        );
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
