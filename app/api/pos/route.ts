import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const posList = await db.pOS.findMany({
      where: {
        active: true,
        center: { tenantId },
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
