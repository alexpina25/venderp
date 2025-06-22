// app/actions/createMachine.ts
"use server";

import { db } from "@/lib/db";
import { generateCustomId } from "@/lib/customId";
import { z } from "zod";
import { MachineStatus, MachineType } from "@prisma/client";
import { getServerAuthSession } from "@/lib/auth";

const schema = z.object({
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  posId: z.string().optional(),
  centerId: z.string().optional(),
  installedAt: z.string().optional(), // viene como string del input type="date"
});

export async function createMachine(input: z.infer<typeof schema>) {
  const data = schema.parse(input);
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;
  if (!tenantId) throw new Error("Tenant not found");

  const customId = await generateCustomId("Machine", tenantId);

  await db.machine.create({
    data: {
      model: data.model || null,
      serialNumber: data.serialNumber || null,
      type: data.type,
      status: data.status,
      posId: data.posId ?? null,
      centerId: data.centerId ?? null,
      installedAt: data.installedAt ? new Date(data.installedAt) : null,
      customId,
    },
  });
}
