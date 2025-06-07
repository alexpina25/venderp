// app/dashboard/page.tsx
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentPofs } from "@/components/dashboard/RecentPofs";
import { RefillStats } from "@/components/dashboard/RefillStats";
import { TotalMachines } from "@/components/dashboard/TotalMachinesCard";
import { MachineConnections } from "@/components/dashboard/MachineConnections";

import { UsersRound, Waypoints, BookOpenCheck } from "lucide-react";

const stats = [
  {
    icon: UsersRound,
    total: "58",
    average: 15,
    title: "Máquinas activas",
    tooltipText: "Total de empresas registradas en el sistema",
  },
  {
    icon: Waypoints,
    total: "86.5%",
    average: 80,
    title: "Tasa de visitas cumplidas",
    tooltipText: "Porcentaje de rutas completadas exitosamente",
  },
  {
    icon: BookOpenCheck,
    total: "363,95€",
    average: 30,
    title: "Ingresos últimos 7 días",
    tooltipText: "Ventas totales aproximadas por máquinas",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-semibold">Dashboard</h2>

      {/* Resumen de métricas */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ icon, total, average, title, tooltipText }) => (
            <StatCard
              key={title}
              icon={icon}
              total={total}
              average={average}
              title={title}
              tooltipText={tooltipText}
            />
          ))}
        </div>
      </section>

      {/* Actividad reciente y estadísticas */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentPofs />
        <RefillStats />
      </section>

      {/* Estado de máquinas y conexiones */}
      <section className="flex flex-col gap-6 xl:flex-row">
        <TotalMachines />
        <MachineConnections />
      </section>
    </div>
  );
}
