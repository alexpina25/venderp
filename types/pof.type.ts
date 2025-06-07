import { POF, Machine, Center } from "@prisma/client";

export type PofWithMachines = POF & {
  center: Center;
  machine: Machine | null;
};

export type PofWithCenter = POF & {
  center: Center;
};
