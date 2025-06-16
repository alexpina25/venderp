import {
  POS,
  Machine,
  MachineProduct,
  Product,
  Center,
  Master,
  Sale,
} from "@prisma/client";

export type PosWithMachines = POS & {
  center: Center;
  machine: Machine | null;
};

export type PosWithMachineDetails = POS & {
  center: Center;
  machine:
    | (Machine & { products: (MachineProduct & { product: Product })[] })
    | null;
  master: Master | null;
};

export type PosWithCenter = POS & {
  center: Center;
};

export type PosWithLastSale = POS & {
  center: Center;
  machine: Machine | null;
  master: Master | null;
  lastSale: Sale | null;
};
