import { db } from "@/lib/db";
import { PosTable } from "@/components/pos/PosTable";
import { NewPosModal } from "@/components/pos/forms/NewPosModal";

export default async function PosPage() {
  const posList = await db.pOS.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      center: true,
      Sale: { orderBy: { timestamp: "desc" }, take: 1 },
    },
  });

  const data = posList.map((p) => ({ ...p, lastSale: p.Sale[0] || null }));

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Puntos De Venta</h2>
        <NewPosModal />
      </div>

      <PosTable data={data} />
    </div>
  );
}
