import { Master, POS, Tenant } from "@prisma/client";

export type MasterWithRelations = Master & {
  tenant: Tenant;
  pos: POS | null;
};
