"use client";
import { useState, useEffect } from "react";
import { PdvInfo } from "@/components/pdv/detail/PdvInfo";
import { MachineDetailsTabs } from "@/components/machines/detail/MachineDetailsTabs";
import { EditPdvModal } from "@/components/pdv/forms/EditPdvModal";
import { PdvWithMachineDetails } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditMachineModal } from "@/components/machines/forms/EditMachineModal";

async function fetchPdvData(id: string): Promise<PdvWithMachineDetails> {
  const res = await fetch(`/api/pdvs/${id}`);
  if (!res.ok) {
    throw new Error("Error fetching PDV data");
  }
  return res.json();
}

export default function PdvDetailPage({ params }: { params: { id: string } }) {
  const [pdv, setPdv] = useState<PdvWithMachineDetails | null>(null);
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
  const [isEditPdvOpen, setIsEditPdvOpen] = useState(false);

  useEffect(() => {
    fetchPdvData(params.id)
      .then(setPdv)
      .catch((err) => console.error(err));
  }, [params.id]);

  const openEditModal = () => setIsMachineModalOpen(true);
  const closeModal = () => setIsMachineModalOpen(false);
  const openPdvEditModal = () => setIsEditPdvOpen(true);
  const closePdvEditModal = () => setIsEditPdvOpen(false);

  const refreshData = async () => {
    const updated = await fetchPdvData(params.id);
    setPdv(updated);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="icon">
          <Link href="/pdvs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Detalle de PDV</h2>
      </div>
      {pdv && (
        <>
          <EditPdvModal
            pdv={pdv}
            open={isEditPdvOpen}
            onClose={async () => {
              closePdvEditModal();
              await refreshData();
            }}
            onSuccess={async () => {
              closePdvEditModal();
              await refreshData();
            }}
          />
          <PdvInfo pdv={pdv} onEdit={openPdvEditModal} />
          {pdv.machine && (
            <>
              <MachineDetailsTabs
                machine={{
                  ...pdv.machine,
                  pos: pdv,
                  products: pdv.machine.products ?? [],
                }}
              />
              <EditMachineModal
                machine={{
                  ...pdv.machine,
                  pos: pdv ? { name: pdv.name } : null,
                }}
                open={isMachineModalOpen}
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
