// app/(routes)/machines/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EditMachineForm } from "@/components/machines/EditMachineForm";

interface EditMachinePageProps {
  params: {
    id: string;
  };
}

export default async function EditMachinePage({ params }: EditMachinePageProps) {
  const machine = await db.machine.findUnique({
    where: { id: params.id },
    include: { location: true },
  });

  const clients = await db.client.findMany({
    orderBy: { name: "asc" },
  });

  if (!machine) return notFound();

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Editar máquina</h2>
      <EditMachineForm machine={machine} clients={clients} />
    </div>
  );
}
