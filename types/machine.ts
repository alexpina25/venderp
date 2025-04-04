export type MachineStatus = "ACTIVE" | "OUT_OF_SERVICE" | "RETIRED";
export type MachineType = "SNACK" | "DRINK" | "COMBO";

export interface Machine {
  id: string;
  code: string;
  model?: string;
  status: MachineStatus;
  type: MachineType;
  location: string;
  lastCheck?: Date;
}
