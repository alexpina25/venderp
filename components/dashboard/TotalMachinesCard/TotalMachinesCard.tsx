import { db } from "@/lib/db";
import { Percent } from "lucide-react";
import { CustomIcon } from "@/components/ui/CustomIcon";
import { TotalMachinesChart, TotalMachinesData } from "./TotalMachinesChart";

export async function TotalMachines() {
    const counts = await db.machine.groupBy({
        by: ["type"],
        _count: { _all: true },
    });

    const colors: Record<string, string> = {
        SNACK: "#8884d8",
        DRINK: "#00C49F",
        COMBO: "#FFBB28",
        CAFE: "#FF8042",
        OTHER: "#AF19FF",
    };

    const data: TotalMachinesData[] = counts.map((c) => ({
        name: c.type,
        value: c._count._all,
        fill: colors[c.type] || "#8884d8",
    }));

    return (
        <div className="w-full p-5 mb-4 transition rounded-lg shadow-sm lg:mb-0 bg-background xl:w-96 hover:shadow-lg">
            <div className="flex items-center mb-4 gap-x-2">
                <CustomIcon icon={Percent} />
                <p className="text-xl">Total Suscribers</p>
            </div>
            <div className="w-full h-[200px] p-5">
                <TotalMachinesChart data={data} />
            </div>
        </div>
    );
}
