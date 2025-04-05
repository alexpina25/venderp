// app/actions/createMachine.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { MachineType, MachineStatus } from "@prisma/client";

const machineSchema = z.object({
  code: z.string().min(2),
  model: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  locationId: z.string(),
});

export async function createMachine(input: z.infer<typeof machineSchema>) {
  const data = machineSchema.parse(input);

  const machine = await db.machine.create({
    data: {
      ...data,
    },
  });

  return machine;
}
