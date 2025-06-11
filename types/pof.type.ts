import { POF, Machine, MachineProduct, Product, Center } from "@prisma/client";

export type PofWithMachines = POF & {
  center: Center;
  machine: Machine | null;
};

export type PofWithMachineDetails = POF & {
  center: Center;
  machine: (Machine & { products: (MachineProduct & { product: Product })[] }) | null;
};

export type PofWithCenter = POF & {
  center: Center;
};
