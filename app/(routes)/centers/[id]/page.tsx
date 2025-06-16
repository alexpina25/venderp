"use client";

import { useEffect, useState } from "react";
import {
  CenterWithPosAndChildren,
  CenterWithParentAndPos,
  PosWithLastSale,
} from "@/types";
import { CenterInfo } from "@/components/centers/detail/CenterInfo";
import { EditCenterModal } from "@/components/centers/forms/EditCenterModal";
import { PosTable } from "@/components/pos/PosTable";
import { CenterTable } from "@/components/centers/CenterTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

async function fetchCenterData(id: string): Promise<CenterWithPosAndChildren> {
  const res = await fetch(`/api/centers/${id}`);
  if (!res.ok) {
    throw new Error("Error fetching center data");
  }
  return res.json();
}

export default function CenterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [center, setCenter] = useState<CenterWithPosAndChildren | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCenterData(params.id)
      .then(setCenter)
      .catch((err) => console.error(err));
  }, [params.id]);

  const refreshData = async () => {
    const updated = await fetchCenterData(params.id);
    setCenter(updated);
  };

  const openEditModal = () => setIsModalOpen(true);
  const closeEditModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="icon">
          <Link href="/centers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Detalle de centro</h2>
      </div>

      {center && (
        <>
          <EditCenterModal
            center={center}
            open={isModalOpen}
            onClose={closeEditModal}
            onSuccess={async () => {
              await refreshData();
              closeEditModal();
            }}
          />
          <CenterInfo center={center} onEdit={openEditModal} />
          <div className="space-y-4 bg-background rounded-lg p-4 border">
            {center.subCenters.length > 0 ? (
              <>
                <h3 className="text-xl font-semibold">Centros asignados</h3>
                <CenterTable
                  data={center.subCenters as CenterWithParentAndPos[]}
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">POS asignados</h3>
                <PosTable
                  data={center.pos.map(
                    (p) =>
                      ({
                        ...p,
                        center: center,
                        lastSale: p.lastSale,
                      } as PosWithLastSale)
                  )}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
