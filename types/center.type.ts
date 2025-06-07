import { Center, POF } from "@prisma/client";

export type CenterWithPofs = Center & {
  pofs: POF[];
};
