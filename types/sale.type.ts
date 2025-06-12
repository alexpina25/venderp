import { Sale, Product, POS } from "@prisma/client";

export type SaleWithDetails = Sale & {
  pos: POS;
  product: Product;
};
