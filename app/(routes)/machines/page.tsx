import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { MachineTable } from "@/components/machines/MachineTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function MachinesPage() {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;

  const machines = await db.machine.findMany({
    where: { tenantId },
    include: {
      pos: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Máquinas</h2>
        <Button asChild variant="default" size="sm" className="gap-1">
          <Link href="/machines/new">
            <Plus className="w-4 h-4" />
            Nueva máquina
          </Link>
        </Button>
      </div>

      <MachineTable data={machines} />
    </div>
  );
}
