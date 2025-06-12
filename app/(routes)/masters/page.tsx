import { db } from "@/lib/db";
import { MasterTable } from "@/components/masters/MasterTable";

export default async function MastersPage() {
  const masters = await db.master.findMany({
    include: { pos: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <h2 className="text-2xl font-bold">Masters</h2>
      <MasterTable data={masters} />
    </div>
  );
}
