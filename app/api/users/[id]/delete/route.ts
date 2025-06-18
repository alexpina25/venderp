import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const user = await db.user.findFirst({
      where: { id: userId, tenantId },
      include: {
        routes: true,
        maintenance: true,
        activityLogs: true,
        centers: true,
        pos: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (
      user.routes.length > 0 ||
      user.maintenance.length > 0 ||
      user.activityLogs.length > 0
    ) {
      return NextResponse.json(
        { error: "No se puede eliminar porque tiene registros asociados" },
        { status: 400 }
      );
    }

    await db.centerUser.deleteMany({ where: { userId } });
    await db.pOSUser.deleteMany({ where: { userId } });
    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error eliminando el usuario" }, { status: 500 });
  }
}