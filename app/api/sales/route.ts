import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SaleMethod } from "@prisma/client";

const saleSchema = z.object({
  pdvCode: z.string(),
  line: z.string(),
  method: z.nativeEnum(SaleMethod),
  price: z.number(),
  inserted: z.number(),
  change: z.number(),
  timestamp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.DEVICE_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = saleSchema.parse(await req.json());

    const pdv = await db.pDV.findFirst({
      where: { code: data.pdvCode },
    });

    if (!pdv) {
      return NextResponse.json({ error: "PDV not found" }, { status: 404 });
    }

    const machine = await db.machine.findFirst({
      where: { posId: pdv.id },
    });

    if (!machine) {
      return NextResponse.json({ error: "Machine not found" }, { status: 404 });
    }

    const machineProduct = await db.machineProduct.findFirst({
      where: { machineId: machine.id, line: data.line },
    });

    if (!machineProduct) {
      return NextResponse.json(
        { error: "Product line not found" },
        { status: 404 }
      );
    }

    await db.machineProduct.update({
      where: { id: machineProduct.id },
      data: { currentStock: { decrement: 1 } },
    });

    const sale = await db.sale.create({
      data: {
        posId: pdv.id,
        productId: machineProduct.productId,
        method: data.method,
        price: data.price,
        inserted: data.inserted,
        change: data.change,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      },
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const pdvId = req.nextUrl.searchParams.get("pdvId");

  const sales = await db.sale.findMany({
    where: pdvId ? { posId: pdvId } : undefined,
    include: { product: true },
    orderBy: { timestamp: "desc" },
  });

  const transformed = sales.map((sale) => ({
    id: sale.id,
    date: sale.timestamp.toISOString(),
    product: sale.product.name,
    paymentMethod: sale.method,
    price: sale.price,
  }));

  return NextResponse.json(transformed);
}
