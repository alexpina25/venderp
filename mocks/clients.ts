import { Client } from "@/types/client";

export const mockClients: Client[] = [
  {
    id: "c1",
    name: "Oficina Central",
    address: "Av. Principal 123, Madrid",
    contactName: "Laura Gómez",
    contactPhone: "+34 600 123 456",
    email: "laura@oficina.com",
    notes: "Visitar solo por las mañanas.",
    createdAt: new Date("2025-03-01T09:00:00Z"),
  },
  // ...
];
