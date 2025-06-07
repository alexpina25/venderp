import { db } from "@/lib/db";
import { CenterTable } from "@/components/centers/CenterTable";
import { NewCenterModal } from "@/components/centers/forms/NewCenterModal";

export default async function CentersPage() {
  const centers = await db.center.findMany({
    orderBy: { name: "desc" },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Centros</h2>
        <NewCenterModal />
      </div>

      <CenterTable data={centers} />
    </div>
  );
}
