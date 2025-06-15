import { Center, POS } from "@prisma/client";
export type CenterWithPos = Center & {
  pos: POS[];
};

export type CenterWithChildren = Center & {
  subCenters: Center[];
};

export type CenterWithParentAndPos = Center & {
  parentCenter: Pick<Center, "name"> | null;
  poss: Pick<POS, "id">[];
};

export type CenterWithActiveChildren = Center & {
  subCenters: Pick<Center, "id">[];
};
