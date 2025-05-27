// app/api/machines/[id]/add-product/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const machineId = params.id;

  if (!machineId) {
    return NextResponse.json(
      { error: "Machine ID not provided." },
      { status: 400 }
    );
  }

  const { productId, quantity, price, line, selection } = await req.json();

  try {
    const updatedMachine = await db.machine.update({
      where: { id: machineId },
      data: {
        products: {
          create: {
            productId,
            currentStock: quantity,
            maxCapacity: quantity,
            minThreshold: 1,
            line,
            selection,
            price
          },
        },
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json(updatedMachine);
  } catch (error) {
    console.error("Error adding product to machine:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
