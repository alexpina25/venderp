import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname } = req.nextUrl;
      const PUBLIC_ROUTES = ["/api/sales", "/api/masters"];

      if (PUBLIC_ROUTES.includes(pathname)) return true;
      return !!token && token.active !== false;
    },
  },
});

export const config = {
  matcher: ["/((?!_next/|favicon.ico|logo.svg|api/sales|api/masters).*)"],
};
