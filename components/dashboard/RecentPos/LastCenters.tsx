import { Building } from "lucide-react";

import { CustomIcon } from "@/components/ui/CustomIcon";
import { CenterTable } from "@/components/centers/CenterTable";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function RecentPos() {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;

  const centers = await db.center.findMany({
    where: { tenantId, subCenters: { none: {} } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      parentCenter: { select: { name: true } },
      pos: { where: { active: true }, select: { id: true } },
    },
  });

  return (
    <div className="p-5 rounded-lg shadow-sm bg-background">
      <div className="flex items-center gap-x-2">
        <CustomIcon icon={Building} />
        <p className="text-xl">Last centers</p>
      </div>
      <div>
        <CenterTable data={centers} />
      </div>
    </div>
  );
}
