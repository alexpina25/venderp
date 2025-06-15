import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
});

export default withAuth(
  function middleware(req) {
    return intlMiddleware(req);
  },

  {
    pages: {
      signIn: "/auth/sign-in",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        const PUBLIC_ROUTES = ["/api/sales", "/api/masters"];

        if (PUBLIC_ROUTES.includes(pathname)) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/|favicon.ico|logo.svg|api/sales|api/masters).*)"],
};
