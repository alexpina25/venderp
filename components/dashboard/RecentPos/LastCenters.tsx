import { Building } from "lucide-react";

import { CustomIcon } from "@/components/ui/CustomIcon";
import { CenterTable } from "@/components/centers/CenterTable";
import { db } from "@/lib/db";

export async function RecentPos() {
    const centers = await db.center.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
    })

    return (
        <div className="p-5 rounded-lg shadow-sm bg-background">
            <div className="flex items-center gap-x-2">
                <CustomIcon icon={Building} />
                <p className="text-xl">Last centers</p>
            </div>
            <div>
                <CenterTable data={centers} />
            </div>
        </div>
    )
}
