import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;

  const user = await db.user.findFirst({
    where: { id: params.id, tenantId },
    include: {
      centers: { include: { center: true } },
      pos: { include: { pos: true } },
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const result = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    center: user.centers[0]?.center ?? null,
    pos: user.pos[0]?.pos ?? null,
  };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
