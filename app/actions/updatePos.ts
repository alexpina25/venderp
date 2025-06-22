"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  name: z.string().min(2),
  address: z.string().min(2),
  notes: z.string().optional(),
  coverage: z.coerce.number().min(0).max(31).optional(),
  machineId: z.string().optional(),
  masterId: z.string().optional(),
});

export async function updatePos(input: z.infer<typeof schema>) {
  const values = schema.parse(input);

  await db.pOS.update({
    where: { id: values.id },
    data: {
      name: values.name,
      address: values.address,
      notes: values.notes,
      coverage: values.coverage ?? 0,
      ...(values.machineId
        ? { machine: { connect: { id: values.machineId } } }
        : { machine: { disconnect: true } }),
      ...(values.masterId
        ? { master: { connect: { id: values.masterId } } }
        : { master: { disconnect: true } }),
    },
  });
}
