"use client";
import { useState, useEffect } from "react";
import { PosInfo } from "@/components/pos/detail/PosInfo";
import { MachineDetailsTabs } from "@/components/machines/detail/MachineDetailsTabs";
import { EditMachineModal } from "@/components/machines/forms/EditMachineModal";
import { PosWithMachineDetails } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

async function fetchPosData(id: string): Promise<PosWithMachineDetails> {
  const res = await fetch(`/api/pos/${id}`);
  if (!res.ok) {
    throw new Error("Error fetching POS data");
  }
  return res.json();
}

export default function PosDetailPage({ params }: { params: { id: string } }) {
  const [pos, setPos] = useState<PosWithMachineDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosData(params.id)
      .then(setPos)
      .catch((err) => console.error(err));
  }, [params.id]);

  const openEditModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const refreshData = async () => {
    const updated = await fetchPosData(params.id);
    setPos(updated);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="icon">
          <Link href="/machines">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Detalle de POS</h2>
      </div>
      {pos && (
        <>
          <PosInfo pos={pos} />
          {pos.machine && (
            <>
              <MachineDetailsTabs
                machine={{
                  ...pos.machine,
                  pos: pos,
                  products: pos.machine.products ?? [],
                }}
              />
              <EditMachineModal
                machine={{
                  ...pos.machine,
                  pos: pos ? { name: pos.name } : null,
                }}
                open={isModalOpen}
                onClose={async () => {
                  closeModal();
                  await refreshData();
                }}
                onSuccess={async () => {
                  closeModal();
                  await refreshData();
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
