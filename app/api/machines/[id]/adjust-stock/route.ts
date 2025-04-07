import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const machineId = params.id;
  const { machineProductId, quantity } = await req.json();

  try {
    const machineProduct = await db.machineProduct.findUnique({
      where: { id: machineProductId, machineId },
    });

    if (!machineProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const newStock = machineProduct.currentStock + quantity;

    if (newStock < 0 || newStock > machineProduct.maxCapacity) {
      return NextResponse.json(
        {
          error:
            "Stock inválido. No puede ser negativo ni superar la capacidad máxima.",
        },
        { status: 400 }
      );
    }

    await db.machineProduct.update({
      where: { id: machineProductId },
      data: { currentStock: newStock },
    });

    return NextResponse.json({ message: "Stock ajustado correctamente" });
  } catch (error) {
    console.error("Error ajustando stock:", error);
    return NextResponse.json(
      { error: "Error ajustando stock" },
      { status: 500 }
    );
  }
}
