import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/imports(.*)",
  "/products(.*)",
  "/upload(.*)",
  "/exports(.*)",
  "/api(.*)",
]);

const isPublicApi = createRouteMatcher(["/api/inngest(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApi(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
