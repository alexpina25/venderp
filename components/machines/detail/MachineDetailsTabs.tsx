"use client";

import { useState } from "react";
import { Machine, MachineProduct, Product } from "@prisma/client";
import { MachineStockTable } from "@/components/machines/detail/MachineStockTable"; // Stock
import { MaintenanceHistoryTable } from "@/components/machines/detail/MaintenanceHistoryTable"; // Mantenimiento
import { Button } from "@/components/ui/button";
import { Client } from "@clerk/nextjs/server";

// Extiende el tipo de máquina para incluir productosinterface MachineWithProducts extends Machine {

export interface MachineWithProducts extends Machine {
  location: Client;
  products: (MachineProduct & { product: Product })[];
}

interface Props {
  machine: MachineWithProducts;
}

export function MachineDetailsTabs({ machine }: Props) {
  const [activeTab, setActiveTab] = useState<string>("stock");

  // Definir el contenido de las pestañas
  const renderTabContent = () => {
    switch (activeTab) {
      case "stock":
        // Pasa los productos a la tabla de stock
        return <MachineStockTable machine={machine} />;
      case "maintenance":
        return <MaintenanceHistoryTable machineId={machine.id} />;
      case "sales":
        return <div>Ventas (por implementar)</div>; // Implementar ventas
      default:
        return <div>Selecciona una sección.</div>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Pestañas de navegación */}
      <div className="flex border-b border-gray-300 gap-1">
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
      </div>

      {/* Contenido de la sección activa */}
      {renderTabContent()}
    </div>
  );
}
