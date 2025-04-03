import { RecentLocations } from "@/components/dashboard/RecentLocations";
import { StatCard } from "@/components/dashboard/StatCard";

import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs";
import { BookOpenCheck, UsersRound, Waypoints } from "lucide-react";
import { RefillStats } from "../../components/dashboard/RefillStats";
import { MachineConnections } from "@/components/dashboard/MachineConecctions";
import { TotalMachines } from "../../components/dashboard/TotalMachinesCard";


const dataCardsStats = [
  {
    icon: UsersRound,
    total: "12.450",
    average: 15,
    title: "Companies created",
    tooltipText: "See all of the companies created"
  },
  {
    icon: Waypoints,
    total: "86.5%",
    average: 80,
    title: "Total Revenue",
    tooltipText: "See all of the summary"
  },
  {
    icon: BookOpenCheck,
    total: "363,95€",
    average: 30,
    title: "Bounce Rate",
    tooltipText: "See all of the bounce rate"
  },
]

export default function Home() {
  return (
    <div>
      <h2 className="mb-4 text-2xl">Dashboard</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-20">
        {dataCardsStats.map(({ icon, total, average, title, tooltipText }) => (
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
      <div className="grid grid-cols-1 mt-12 xl:grid-cols-2 md:gap-x-10">
        <RecentLocations />
        <RefillStats />
      </div>
      <div className="flex-col justify-center mt-12 md:gap-x-10 xl:flex xl:flex-row gap-y-4 md:gap-y-0 md:mb-10">
        <TotalMachines />
        <MachineConnections />
      </div>
    </div>
  );
}
