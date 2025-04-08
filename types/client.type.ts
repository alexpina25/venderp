import { Client, Location } from "@prisma/client";

export type ClientWithLocations = Client & {
  locations: Location[];
};
