// app/api/products/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const products = await db.product.findMany({
      where: {
        tenantId,
        active: true,
      },
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        unit: true,
        imageUrl: true, // Si deseas incluir la URL de la imagen
      },
    });

    // Retorna los productos en formato JSON
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.error();
  }
}
