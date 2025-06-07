import {
  Machine,
  MachineProduct,
  Product,
  Center,
  POF,
} from "@prisma/client";

export type MachineWithDetails = Machine & {
  center: Center;
  pof: POF;
  products: (MachineProduct & {
    product: Product;
  })[];
};
