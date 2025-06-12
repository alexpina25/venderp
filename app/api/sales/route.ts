import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SaleMethod } from "@prisma/client";

const saleSchema = z.object({
  posCode: z.string(),
  line: z.string(),
  method: z.nativeEnum(SaleMethod),
  price: z.number(),
  inserted: z.number(),
  change: z.number(),
  timestamp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = saleSchema.parse(await req.json());

    const pos = await db.pOS.findFirst({
      where: { code: data.posCode },
    });

    if (!pos) {
      return NextResponse.json({ error: "POS not found" }, { status: 404 });
    }

    const machine = await db.machine.findFirst({
      where: { posId: pos.id },
    });

    if (!machine) {
      return NextResponse.json(
        { error: "Machine not found" },
        { status: 404 }
      );
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
        machineId: machine.id,
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
  const machineId = req.nextUrl.searchParams.get("machineId");
  const where = machineId ? { machineId } : undefined;

  const sales = await db.sale.findMany({
    where,
    include: { machine: true, product: true },
    orderBy: { timestamp: "desc" },
  });

  return NextResponse.json(sales);
}
