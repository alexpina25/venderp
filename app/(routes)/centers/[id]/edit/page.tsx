import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditCenterForm } from "@/components/centers/forms/EditCenterForm";

interface EditPageProps {
  params: { id: string };
}

export default async function EditCenterPage({ params }: EditPageProps) {
  const center = await db.center.findUnique({
    where: { id: params.id },
  });

  if (!center) return notFound();

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Editar centro</h2>
      <EditCenterForm center={center} />
    </div>
  );
}
