import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const posId = params.id;
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const pos = await db.pOS.findFirst({
      where: { id: posId, center: { tenantId } },
      include: { machine: true, Sale: true, RouteStop: true, users: true },
    });

    if (!pos) {
      return NextResponse.json({ error: "POS no encontrado" }, { status: 404 });
    }

    if (pos.machine || pos.Sale.length > 0 || pos.RouteStop.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar porque tiene registros asociados" },
        { status: 400 }
      );
    }

    await db.pOSUser.deleteMany({ where: { posId } });
    await db.pOS.delete({ where: { id: posId } });
    return NextResponse.json({ message: "POS eliminado" });
  } catch (error) {
    console.error("Error deleting POS:", error);
    return NextResponse.json(
      { error: "Error eliminando el POS" },
      { status: 500 }
    );
  }
}
