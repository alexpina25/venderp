import { User, Route } from "@prisma/client";

export type UserWithRoutes = User & {
  routes: Route[];
};

export type UserDetail = User & {
  center?: { id: string; name: string } | null;
  pos?: { id: string; name: string } | null;
};
