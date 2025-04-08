import { Product, MachineProduct } from "@prisma/client";

export type ProductWithMachineStock = Product & {
  machineStocks: MachineProduct[];
};
