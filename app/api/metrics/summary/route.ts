import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const [activeMachines, totalMachines, sales] = await Promise.all([
      db.machine.count({ where: { status: "ACTIVE", center: { tenantId } } }),
      db.machine.count({ where: { center: { tenantId } } }),
      db.sale.aggregate({
        _sum: { price: true },
        where: {
          timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          pos: { center: { tenantId } },
        },
      }),
    ]);

    return NextResponse.json({
      activeMachines,
      totalMachines,
      recentSales: sales._sum.price || 0,
    });
  } catch (error) {
    console.error("Metrics summary error:", error);
    return new Response("Error generating metrics summary", { status: 500 });
  }
}

