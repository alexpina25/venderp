import { Center, POS } from "@prisma/client";
export type CenterWithPos = Center & {
  pos: POS[];
};

export type CenterWithChildren = Center & {
  subCenters: Center[];
};

export type CenterWithParentAndPos = Center & {
  parentCenter: Pick<Center, "name"> | null;
  pos: Pick<POS, "id">[];
};

export type CenterWithActiveChildren = Center & {
  subCenters: Pick<Center, "id">[];
};

export type CenterWithPosAndChildren = Center & {
  pos: POS[];
  subCenters: CenterWithParentAndPos[];
};
