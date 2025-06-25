"use client";
import { useState, useEffect } from "react";
import { MachineInfo } from "@/components/machines/detail/MachineInfo";
import { EditMachineModal } from "@/components/machines/forms/EditMachineModal";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { MachineWithDetails } from "@/types";
import { MachineDetailsTabs } from "@/components/machines/detail/MachineDetailsTabs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

async function fetchMachineData(id: string) {
  const response = await fetch(`/api/machines/${id}`);
  if (!response.ok) {
    throw new Error("Error fetching machine data");
  }
  return response.json();
}

export default function MachineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [selectedMachine, setSelectedMachine] = useState<MachineWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch machine data on initial load or when the ID changes
  useEffect(() => {
    async function getMachine() {
      try {
        const machine = await fetchMachineData(params.id);
        setSelectedMachine(machine);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la máquina",
        });
      } finally {
        setLoading(false);
      }
    }

    getMachine();
  }, [params.id]);

  // Open the Edit Machine Modal
  const openEditModal = (machine: MachineWithDetails) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMachine(null);
  };

  const handleEditSuccess = async () => {
    try {
      const updatedMachine = await fetchMachineData(params.id); // Volver a obtener los datos actualizados
      setSelectedMachine(updatedMachine); // Actualiza el estado con la nueva máquina
      setIsModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error(
        "Error al obtener los datos actualizados de la máquina",
        error
      );
    }
  };

  const handleCancel = async () => {

    try {
      const updatedMachine = await fetchMachineData(params.id); // Volver a obtener los datos actuales
      setSelectedMachine(updatedMachine); // Actualiza el estado con los datos más recientes
      setIsModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error al obtener los datos actuales de la máquina", error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="icon">
          <Link href="/machines">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Detalle de máquina</h2>
      </div>
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}
      {!loading && selectedMachine && (
        <>
          {/* Información básica de la máquina */}
          <MachineInfo machine={selectedMachine} onEdit={openEditModal} />

          {/* Secciones de detalle: stock, mantenimiento, etc. */}
          <MachineDetailsTabs machine={selectedMachine} />

          {/* Modal de edición */}
          <EditMachineModal
            machine={selectedMachine}
            open={isModalOpen}
            onClose={handleCancel}
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </div>
  );
}
