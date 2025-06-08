import { Center, POF } from "@prisma/client";

export type CenterWithPofs = Center & {
  pofs: POF[];
};

export type CenterWithChildren = Center & {
  subCenters: Center[];
};
