"use client";

import { useState } from "react";
import { Machine, MachineProduct, Product, POS } from "@prisma/client";
import { MachineStockTable } from "@/components/machines/detail/stock/MachineStockTable"; // Stock
import { MaintenanceHistoryTable } from "@/components/machines/detail/MaintenanceHistoryTable"; // Mantenimiento
import { MachineSalesTable } from "@/components/machines/detail/sales/MachineSalesTable"; // Ventas
import { Button } from "@/components/ui/button";

export interface MachineWithProducts extends Machine {
  pos: POS | null;
  products: (MachineProduct & { product: Product })[];
}

interface Props {
  machine: MachineWithProducts;
}

export function MachineDetailsTabs({ machine }: Props) {
  const [activeTab, setActiveTab] = useState<string>("sales");

  // Definir el contenido de las pestañas
  const renderTabContent = () => {
    switch (activeTab) {
      case "stock":
        // Pasa los productos a la tabla de stock
        return <MachineStockTable machine={machine} />;
      case "maintenance":
        return <MaintenanceHistoryTable machineId={machine.id} />;
      case "sales":
        return machine.pos ? (
          <MachineSalesTable posId={machine.pos.id} />
        ) : (
          <div>No POS asociado</div>
        );
      default:
        return <div>Selecciona una sección.</div>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Pestañas de navegación */}
      <div className="flex border-b border-gray-300 gap-1">
        <Button
          onClick={() => setActiveTab("sales")}
          variant={activeTab === "sales" ? "default" : "outline"}
          size="sm"
          className={`p-2 text-lg rounded-t-lg transition-all duration-300 ${
            activeTab === "sales"
              ? "bg-blue-500 text-white"
              : "bg-transparent text-gray-600"
          }`}
        >
          Ventas
        </Button>
        
        <Button
          onClick={() => setActiveTab("stock")}
          variant={activeTab === "stock" ? "default" : "outline"}
          size="sm"
          className={`p-2 text-lg rounded-t-lg transition-all duration-300 ${
            activeTab === "stock"
              ? "bg-blue-500 text-white"
              : "bg-transparent text-gray-600"
          }`}
        >
          Stock
        </Button>
        <Button
          onClick={() => setActiveTab("maintenance")}
          variant={activeTab === "maintenance" ? "default" : "outline"}
          size="sm"
          className={`p-2 text-lg rounded-t-lg transition-all duration-300 ${
            activeTab === "maintenance"
              ? "bg-blue-500 text-white"
              : "bg-transparent text-gray-600"
          }`}
        >
          Mantenimiento
        </Button>
      </div>

      {/* Contenido de la sección activa */}
      {renderTabContent()}
    </div>
  );
}
