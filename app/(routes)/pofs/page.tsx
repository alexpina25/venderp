import { db } from "@/lib/db";
import { PofTable } from "@/components/pofs/PofTable";
import { NewPofModal } from "@/components/pofs/forms/NewPofModal";

export default async function PofsPage() {
  const pofs = await db.pOF.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      center: true, // Para poder ver a qué centro pertenece cada POF
    },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">POF</h2>
        <NewPofModal />
      </div>

      <PofTable data={pofs} />
    </div>
  );
}
