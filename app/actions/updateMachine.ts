// app/actions/updateMachine.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { MachineStatus, MachineType } from "@prisma/client";

const schema = z.object({
  id: z.string(),
  code: z.string().min(2),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  locationId: z.string(),
  installedAt: z.string().optional(), // viene como string del input
});

export async function updateMachine(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.machine.update({
    where: { id: data.id },
    data: {
      code: data.code,
      model: data.model || null,
      serialNumber: data.serialNumber || null,
      type: data.type,
      status: data.status,
      locationId: data.locationId,
      installedAt: data.installedAt ? new Date(data.installedAt) : null,
    },
  });
}
