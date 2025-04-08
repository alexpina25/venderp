import { User, Route } from "@prisma/client";

export type UserWithRoutes = User & {
  routes: Route[];
};
