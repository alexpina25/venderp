// app/actions/createMachine.ts
"use server";

import { db } from "@/lib/db";
import { generateCustomId } from "@/lib/customId";
import { z } from "zod";
import { MachineStatus, MachineType } from "@prisma/client";
import { getServerAuthSession } from "@/lib/auth";

const schema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
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
      brand: data.brand || null,
      model: data.model || null,
      serialNumber: data.serialNumber || null,
      type: data.type,
      status: data.status,
      tenantId,
      installedAt: data.installedAt ? new Date(data.installedAt) : null,
      customId,
    },
  });
}
