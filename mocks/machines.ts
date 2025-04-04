import { Machine } from "@/types/machine";

export const mockMachines: Machine[] = [
  {
    id: "1",
    code: "VND-001",
    model: "Zebra Max 3000",
    status: "ACTIVE",
    type: "SNACK",
    location: "Oficina Central - Planta Baja",
    lastCheck: new Date("2025-04-01T10:00:00Z"),
  },
  // ...
];