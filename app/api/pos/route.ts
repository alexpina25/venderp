import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posList = await db.pos.findMany({
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

    return NextResponse.json(posList);
  } catch (error) {
    console.error("Error fetching POS:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
