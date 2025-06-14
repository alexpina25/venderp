import { Sale, Product, POS as PDV } from "@prisma/client";

export type SaleWithDetails = Sale & {
  pos: PDV;
  product: Product;
};
