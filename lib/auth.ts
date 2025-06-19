import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        const user = await db.user.findUnique({
          where: { id: token.sub as string },
          include: { tenant: true },
        });
        session.user.role = user?.role ?? null;
        if (user?.tenant) {
          session.user.tenant = {
            id: user.tenant.id,
            name: user.tenant.name,
          };
        } else {
          session.user.tenant = null;
        }
      }
      return session;
    },
  },
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
