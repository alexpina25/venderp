// app/actions/createMachine.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { MachineStatus, MachineType } from "@prisma/client";

const schema = z.object({
  code: z.string().min(2),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  pdvId: z.string(),
  centerId: z.string(),
  installedAt: z.string().optional(), // viene como string del input type="date"
});

export async function createMachine(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.machine.create({
    data: {
      code: data.code,
      model: data.model || null,
      serialNumber: data.serialNumber || null,
      type: data.type,
      status: data.status,
      posId: data.pdvId,
      centerId: data.centerId,
      installedAt: data.installedAt ? new Date(data.installedAt) : null,
    },
  });
}
