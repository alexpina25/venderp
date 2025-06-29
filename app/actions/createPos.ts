"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateCustomId } from "@/lib/customId";

interface CreatePosInput {
  code: string;
  name: string;
  address: string;
  city: string;
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
      city: data.city,
      notes: data.notes,
      coverage: 0,
      customId: await generateCustomId("POS", center.tenantId),
      center: { connect: { id: data.centerId } },
      ...(data.machineId && { machine: { connect: { id: data.machineId } } }),
      ...(data.masterId && { master: { connect: { id: data.masterId } } }),
    },
  });

  revalidatePath("/pos");
}
