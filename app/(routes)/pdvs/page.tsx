import { db } from "@/lib/db";
import { PdvTable } from "@/components/pdv/PdvTable";
import { NewPdvModal } from "@/components/pdv/forms/NewPdvModal";

export default async function PdvPage() {
  const pdvList = await db.pOS.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      center: true, // Para poder ver a qué centro pertenece cada PDV
    },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">PDVs</h2>
        <NewPdvModal />
      </div>

      <PdvTable data={pdvList} />
    </div>
  );
}
