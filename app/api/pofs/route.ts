import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pofs = await db.pof.findMany({
      where: {
        active: true,
      },
      include: {
        center: true, // Incluye datos del centro
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(pofs);
  } catch (error) {
    console.error("Error fetching pofs:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
