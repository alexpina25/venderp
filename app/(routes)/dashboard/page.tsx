// app/dashboard/page.tsx
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentPos } from "@/components/dashboard/RecentPos";
import { RefillStats } from "@/components/dashboard/RefillStats";
import { TotalMachines } from "@/components/dashboard/TotalMachinesCard";
import { MachineConnections } from "@/components/dashboard/MachineConnections";
import { UsersRound, Waypoints, BookOpenCheck } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/formatPrice";

export default async function DashboardPage() {
  const [activeMachines, totalMachines, sales] = await Promise.all([
    db.machine.count({ where: { status: "ACTIVE" } }),
    db.machine.count(),
    db.sale.aggregate({
      _sum: { price: true },
      where: { timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const rate = totalMachines
    ? Math.round((activeMachines / totalMachines) * 100)
    : 0;

  const stats = [
    {
      icon: UsersRound,
      total: String(activeMachines),
      average: rate,
      title: "Máquinas activas",
      tooltipText: "Total de máquinas registradas en el sistema",
    },
    {
      icon: Waypoints,
      total: `${rate}%`,
      average: rate,
      title: "Tasa de máquinas en servicio",
      tooltipText: "Porcentaje de máquinas activas sobre el total",
    },
    {
      icon: BookOpenCheck,
      total: formatPrice(sales._sum.price || 0),
      average: 0,
      title: "Ingresos últimos 7 días",
      tooltipText: "Ventas totales aproximadas por máquinas",
    },
  ];

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
        <RecentPos />
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
