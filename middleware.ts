import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/api/webhooks/clerk']);

export default clerkMiddleware((auth, req) => {
    if (!isPublicRoute) {
        auth().protect();
    }
    // authorizedParties: ['/', '/api/webhooks/clerk'],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};