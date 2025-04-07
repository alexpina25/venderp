// app/api/products/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Asegúrate de que tienes prisma correctamente configurado

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: {
        active: true, // Filtrar productos activos (puedes cambiar esto según sea necesario)
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
