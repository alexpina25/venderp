import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const product = await db.product.findFirst({
      where: { id: productId, tenantId },
      include: { machineStocks: true, replenishmentItems: true, sales: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    if (
      product.machineStocks.length > 0 ||
      product.replenishmentItems.length > 0 ||
      product.sales.length > 0
    ) {
      return NextResponse.json(
        { error: "No se puede eliminar porque tiene registros asociados" },
        { status: 400 }
      );
    }

    await db.product.delete({ where: { id: productId } });
    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error eliminando el producto" },
      { status: 500 }
    );
  }
}