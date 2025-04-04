export type MaintenanceType = "PREVENTIVE" | "CORRECTIVE";

export interface Maintenance {
  id: string;
  machineId: string;
  machineCode: string;
  date: Date;
  type: MaintenanceType;
  operator: string;
  description: string;
}
