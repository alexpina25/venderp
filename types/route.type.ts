import { Route, RouteStop, POS, User } from "@prisma/client";

export type RouteWithStops = Route & {
    operator: User | null;
  stops: (RouteStop & { pos: POS })[];
};
