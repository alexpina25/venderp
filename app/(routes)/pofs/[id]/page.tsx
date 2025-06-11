"use client";
import { useState, useEffect } from "react";
import { PofInfo } from "@/components/pofs/detail/PofInfo";
import { MachineInfo } from "@/components/machines/detail/MachineInfo";
import { MachineDetailsTabs } from "@/components/machines/detail/MachineDetailsTabs";
import { EditMachineModal } from "@/components/machines/forms/EditMachineModal";
import { PofWithMachineDetails } from "@/types";

async function fetchPofData(id: string): Promise<PofWithMachineDetails> {
  const res = await fetch(`/api/pofs/${id}`);
  if (!res.ok) {
    throw new Error("Error fetching POF data");
  }
  return res.json();
}

export default function PofDetailPage({ params }: { params: { id: string } }) {
  const [pof, setPof] = useState<PofWithMachineDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPofData(params.id)
      .then(setPof)
      .catch((err) => console.error(err));
  }, [params.id]);

  const openEditModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const refreshData = async () => {
    const updated = await fetchPofData(params.id);
    setPof(updated);
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Detalle de POF</h2>
      {pof && (
        <>
          <PofInfo pof={pof} />
          {pof.machine && (
            <>
              <MachineInfo machine={pof.machine} onEdit={openEditModal} />
              <MachineDetailsTabs machine={pof.machine} />
              <EditMachineModal
                machine={pof.machine}
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
