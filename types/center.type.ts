import { Center, POS } from "@prisma/client";
export type CenterWithPos = Center & {
  pos: POS[];
};

export type CenterWithChildren = Center & {
  subCenters: Center[];
};
