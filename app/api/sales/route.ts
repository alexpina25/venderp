import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { ok, error, handleError } from "@/lib/apiResponses";
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
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.DEVICE_API_KEY) {
    return error("Unauthorized", 401);
  }

  try {
    const data = saleSchema.parse(await req.json());

    const pos = await db.pOS.findFirst({
      where: { code: data.posCode },
    });

    if (!pos) {
      return error("POS not found", 404);
    }

    const machine = await db.machine.findFirst({
      where: { posId: pos.id },
    });

    if (!machine) {
      return error("Machine not found", 404);
    }

    const machineProduct = await db.machineProduct.findFirst({
      where: { machineId: machine.id, line: data.line },
    });

    if (!machineProduct) {
      return error("Product line not found", 404);
    }

    await db.machineProduct.update({
      where: { id: machineProduct.id },
      data: { currentStock: { decrement: 1 } },
    });

    const sale = await db.sale.create({
      data: {
        posId: pos.id,
        productId: machineProduct.productId,
        method: data.method,
        price: data.price,
        inserted: data.inserted,
        change: data.change,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      },
    });

    return ok(sale, { status: 201 });
  } catch (error) {
    return handleError(error, "Invalid data");
  }
}

export async function GET(req: NextRequest) {
  const posId = req.nextUrl.searchParams.get("posId");
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;

  const sales = await db.sale.findMany({
    where: {
      ...(posId ? { posId } : {}),
      pos: { center: { tenantId } },
    },
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

  return ok(transformed);
}
