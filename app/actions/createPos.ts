"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreatePosInput {
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  province?: string;
  country?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  centerId: string;
}

export async function createPos(data: CreatePosInput) {
  await db.pos.create({
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      province: data.province,
      country: data.country || "España",
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      notes: data.notes,
      centerId: data.centerId,
    },
  });

  // Revalida la ruta de ubicaciones si tienes una página de lista
  revalidatePath("/pos");
}
