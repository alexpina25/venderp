import {
  Machine,
  MachineProduct,
  Product,
  Client,
  Location,
} from "@prisma/client";

export type MachineWithDetails = Machine & {
  client: Client;
  location: Location;
  products: (MachineProduct & {
    product: Product;
  })[];
};
