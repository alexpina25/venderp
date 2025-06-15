import { db } from "@/lib/db";
import { PosTable } from "@/components/pos/PosTable";
import { NewPosModal } from "@/components/pos/forms/NewPosModal";

export default async function PosPage() {
  const posList = await db.pOS.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      center: true, // Para poder ver a qué centro pertenece cada POS
    },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">POSs</h2>
        <NewPosModal />
      </div>

      <PosTable data={posList} />
    </div>
  );
}
