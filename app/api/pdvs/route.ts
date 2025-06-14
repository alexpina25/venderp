import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pdvList = await db.pOS.findMany({
      where: {
        active: true,
      },
      include: {
        center: true,
        master: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(pdvList);
  } catch (error) {
    console.error("Error fetching PDV:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
