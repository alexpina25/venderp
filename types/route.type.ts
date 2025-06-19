import { Route, RouteStop, POS } from "@prisma/client";

export type RouteWithStops = Route & {
  stops: (RouteStop & { pos: POS })[];
};
