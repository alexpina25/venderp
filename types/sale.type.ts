import { Sale, Machine, Product } from "@prisma/client";

export type SaleWithDetails = Sale & {
  machine: Machine;
  product: Product;
};