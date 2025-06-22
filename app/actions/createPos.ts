"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateCustomId } from "@/lib/customId";

interface CreatePosInput {
  code: string;
  name: string;
  address: string;
  notes?: string;
  centerId: string;
  machineId?: string;
  masterId?: string;
}

export async function createPos(data: CreatePosInput) {
  const center = await db.center.findUnique({
    where: { id: data.centerId },
    select: { tenantId: true },
  });
  if (!center) throw new Error("Center not found");

  await db.pOS.create({
    data: {
      code: data.code,
      name: data.name,
      address: data.address,
      notes: data.notes,
      centerId: data.centerId,
      coverage: 0,
      customId: await generateCustomId("POS", center.tenantId),
      ...(data.machineId ? { machine: { connect: { id: data.machineId } } } : {}),
      ...(data.masterId ? { master: { connect: { id: data.masterId } } } : {}),
    },
  });

  revalidatePath("/pos");
}
