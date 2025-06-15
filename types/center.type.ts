import { Center, POS } from "@prisma/client";
export type CenterWithPos = Center & {
  poss: POS[];
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
