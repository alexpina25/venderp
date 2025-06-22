import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const machineId = params.id;
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const machine = await db.machine.findFirst({
      where: { id: machineId, tenantId },
      include: {
        products: true,
        maintenanceLog: true,
        replenishments: true,
        sales: true,
        pos: true,
      },
    });

    if (!machine) {
      return NextResponse.json(
        { error: "Máquina no encontrada" },
        { status: 404 }
      );
    }

    if (
      machine.products.length > 0 ||
      machine.maintenanceLog.length > 0 ||
      machine.replenishments.length > 0 ||
      machine.sales.length > 0 ||
      machine.pos
    ) {
      return NextResponse.json(
        { error: "No se puede eliminar porque tiene registros asociados" },
        { status: 400 }
      );
    }

    await db.machine.delete({ where: { id: machineId } });
    return NextResponse.json({ message: "Máquina eliminada" });
  } catch (error) {
    console.error("Error deleting machine:", error);
    return NextResponse.json(
      { error: "Error eliminando la máquina" },
      { status: 500 }
    );
  }
}