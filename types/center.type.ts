import { Center, POS as PDV } from "@prisma/client";
export type CenterWithPdv = Center & {
  pdvs: PDV[];
};

export type CenterWithChildren = Center & {
  subCenters: Center[];
};

export type CenterWithParentAndPdv = Center & {
  parentCenter: Pick<Center, "name"> | null;
  pdvs: Pick<PDV, "id">[];
};

export type CenterWithActiveChildren = Center & {
  subCenters: Pick<Center, "id">[];
};
