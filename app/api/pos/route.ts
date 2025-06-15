import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posList = await db.pos.findMany({
      where: {
        active: true,
      },
      include: {
        center: true,
        master: true,
        Sale: { orderBy: { timestamp: "desc" }, take: 1 },
      },
      orderBy: {
        name: "asc",
      },
    });

    const withLastSale = posList.map((p) => ({
      ...p,
      lastSale: p.Sale[0] || null,
    }));

    return NextResponse.json(withLastSale);
  } catch (error) {
    console.error("Error fetching POS:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
