import {
  Machine,
  MachineProduct,
  Product,
  POS,
} from "@prisma/client";

export type MachineWithDetails = Machine & {
  pos: POS | null;
  products: (MachineProduct & {
    product: Product;
  })[];
};
