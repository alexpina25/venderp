import { Replenishment, ReplenishmentItem, Product } from "@prisma/client";

export type ReplenishmentWithItems = Replenishment & {
  items: (ReplenishmentItem & {
    product: Product;
  })[];
};
