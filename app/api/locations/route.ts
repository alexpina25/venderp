import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const locations = await db.location.findMany({
      where: {
        active: true,
      },
      include: {
        client: true, // Incluye datos del cliente
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
