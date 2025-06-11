import { db } from "@/lib/db";
import { MachineTable } from "@/components/machines/MachineTable";
import { NewMachineModal } from "@/components/machines/forms/NewMachineModal";

export default async function MachinesPage() {
  const machines = await db.machine.findMany({
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
        <NewMachineModal />
      </div>

      <MachineTable data={machines} />
    </div>
  );
}
