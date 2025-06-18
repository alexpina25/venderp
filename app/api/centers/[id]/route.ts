import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { ok, error, handleError } from "@/lib/apiResponses";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const center = await db.center.findFirst({
      where: { id: params.id, tenantId },
      include: {
        pos: {
          include: {
            Sale: { orderBy: { timestamp: "desc" }, take: 1 },
            machine: true,
            master: true,
          },
        },
        subCenters: {
          include: {
            parentCenter: { select: { name: true } },
            pos: { where: { active: true }, select: { id: true } },
          },
        },
      },
    });

    if (!center) {
      return error("Center not found", 404);
    }

    const transformed = {
      ...center,
      pos: center.pos.map((p) => ({ ...p, lastSale: p.Sale[0] || null })),
    };

    return ok(transformed);
  } catch (error) {
    return handleError(error, "Error fetching center");
  }
}
