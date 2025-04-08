import { Location, Machine, Client } from "@prisma/client";

export type LocationWithMachines = Location & {
  client: Client;
  machines: Machine[];
};
