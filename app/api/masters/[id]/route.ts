import { db } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const master = await db.master.findUnique({
      where: { id: params.id },
      include: { pos: true, tenant: true },
    });

    if (!master) {
      return new Response("Master not found", { status: 404 });
    }

    return new Response(JSON.stringify(master), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching master:", error);
    return new Response("Error fetching master", { status: 500 });
  }
}