import { POS, Machine, MachineProduct, Product, Center } from "@prisma/client";

export type PosWithMachines = POS & {
  center: Center;
  machine: Machine | null;
};

export type PosWithMachineDetails = POS & {
  center: Center;
  machine: (Machine & { products: (MachineProduct & { product: Product })[] }) | null;
};

export type PosWithCenter = POS & {
  center: Center;
};
