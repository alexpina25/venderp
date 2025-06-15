import {
  Machine,
  MachineProduct,
  Product,
  Center,
  POS,
} from "@prisma/client";

export type MachineWithDetails = Machine & {
  center: Center;
  pos: POS;
  products: (MachineProduct & {
    product: Product;
  })[];
};
