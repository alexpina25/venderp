// app/actions/updateMachine.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { MachineType, MachineStatus } from "@prisma/client";

const updateSchema = z.object({
  id: z.string(),
  code: z.string().min(2),
  model: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  locationId: z.string(),
});

export async function updateMachine(input: z.infer<typeof updateSchema>) {
  const data = updateSchema.parse(input);

  await db.machine.update({
    where: { id: data.id },
    data: {
      ...data,
    },
  });
}
