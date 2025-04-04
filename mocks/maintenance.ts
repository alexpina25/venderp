import { Maintenance } from "@/types/maintenance";

export const mockMaintenance: Maintenance[] = [
  {
    id: "m1",
    machineId: "2",
    machineCode: "VND-002",
    date: new Date("2025-04-01T15:00:00Z"),
    type: "CORRECTIVE",
    operator: "Lucía Rivas",
    description: "Fallo en dispensador de monedas. Se reemplazó el módulo.",
  },
];
