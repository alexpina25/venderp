import {
  POS as PDV,
  Machine,
  MachineProduct,
  Product,
  Center,
  Master,
} from "@prisma/client";

export type PdvWithMachines = PDV & {
  center: Center;
  machine: Machine | null;
};

export type PdvWithMachineDetails = PDV & {
  center: Center;
  machine:
    | (Machine & { products: (MachineProduct & { product: Product })[] })
    | null;
  master: Master | null;
};

export type PdvWithCenter = PDV & {
  center: Center;
};
