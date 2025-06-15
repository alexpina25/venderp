import {
  Machine,
  MachineProduct,
  Product,
  Center,
  PDV,
} from "@prisma/client";

export type MachineWithDetails = Machine & {
  center: Center;
  pos: PDV;
  products: (MachineProduct & {
    product: Product;
  })[];
};
