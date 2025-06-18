import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const centerId = params.id;
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const center = await db.center.findFirst({
      where: { id: centerId, tenantId },
      include: { subCenters: true, pos: true },
    });

    if (!center) {
      return NextResponse.json(
        { error: "Centro no encontrado" },
        { status: 404 }
      );
    }

    if (center.subCenters.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar porque tiene centros asociados" },
        { status: 400 }
      );
    }

    if (center.pos.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar porque tiene POS asociados" },
        { status: 400 }
      );
    }

    await db.center.delete({ where: { id: centerId } });
    return NextResponse.json({ message: "Centro eliminado" });
  } catch (error) {
    console.error("Error deleting center:", error);
    return NextResponse.json(
      { error: "Error eliminando el centro" },
      { status: 500 }
    );
  }
}
