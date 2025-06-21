import { RouteStop, POS } from "@prisma/client";

export type StopWithPOS = RouteStop & {
  pos: POS;
};
