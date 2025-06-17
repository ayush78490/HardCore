import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sign-out(.*)?', // Explicitly include sign-out
  '/api(.*)',
]);

const isIgnoredRoute = createRouteMatcher([
  '/api/webhook(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isIgnoredRoute(req)) {
    return;
  }
  if (isPublicRoute(req)) {
    return;
  }
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};