import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { MachineInfo } from "@/components/machines/detail/MachineInfo";
import { MachineStockTable } from "@/components/machines/detail/MachineStockTable";

interface MachineDetailPageProps {
  params: { id: string };
}

export default async function MachineDetailPage({
  params,
}: MachineDetailPageProps) {
  const machine = await db.machine.findUnique({
    where: { id: params.id },
    include: {
      location: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!machine) return notFound();

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Detalle de máquina</h2>

      <MachineInfo machine={machine} />

      <div>
        <h3 className="text-xl font-semibold mb-2">Stock actual</h3>
        <MachineStockTable stock={machine.products} />
      </div>
    </div>
  );
}
