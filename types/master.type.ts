import { Master, PDV, Tenant } from "@prisma/client";

export type MasterWithRelations = Master & {
  tenant: Tenant;
  pos: PDV | null;
};
