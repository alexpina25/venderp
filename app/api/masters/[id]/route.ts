import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const master = await db.master.findFirst({
      where: { id: params.id, tenantId },
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
