"use client";
import { useState, useEffect } from "react";
import { MachineInfo } from "@/components/machines/detail/MachineInfo";
import { MachineStockTable } from "@/components/machines/detail/MachineStockTable";
import { EditMachineModal } from "@/components/machines/EditMachineModal";

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
  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch machine data on initial load or when the ID changes
  useEffect(() => {
    async function getMachine() {
      try {
        const machine = await fetchMachineData(params.id);
        setSelectedMachine(machine);
      } catch (error) {
        console.error(error);
      }
    }

    getMachine();
  }, [params.id]);

  // Open the Edit Machine Modal
  const openEditModal = (machine: any) => {
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
    // Aquí también podemos hacer un refetch de la máquina si fuera necesario
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
      <h2 className="text-2xl font-bold">Detalle de máquina</h2>

      {selectedMachine && (
        <>
          <MachineInfo machine={selectedMachine} onEdit={openEditModal} />

          <div>
            <h3 className="text-xl font-semibold mb-2">Stock actual</h3>
            <MachineStockTable stock={selectedMachine.products} />
          </div>

          {/* Modal de edición */}
          <EditMachineModal
            machine={selectedMachine}
            open={isModalOpen}
            onClose={handleCancel} // Cambié aquí a handleCancel para que se refresquen los datos al cerrar
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </div>
  );
}
