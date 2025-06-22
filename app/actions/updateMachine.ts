// app/actions/updateMachine.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { MachineStatus, MachineType } from "@prisma/client";

const schema = z.object({
  id: z.string(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  posId: z.string().optional(),
  installedAt: z.string().optional(), // viene como string del input
});

export async function updateMachine(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.machine.update({
    where: { id: data.id },
    data: {
      model: data.model || null,
      serialNumber: data.serialNumber || null,
      type: data.type,
      status: data.status,
      posId: data.posId ?? null,
      installedAt: data.installedAt ? new Date(data.installedAt) : null,
    },
  });
}
