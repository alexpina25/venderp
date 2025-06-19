import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      role?: string | null;
      active?: boolean | null;
      tenant?: {
        id: string;
        name: string;
      } | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    active?: boolean;
  }
}
export {};
