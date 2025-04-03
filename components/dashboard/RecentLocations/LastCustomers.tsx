import { Building } from "lucide-react";

import { CustomIcon } from "@/components/CustomIcon";
import { ClientsTable } from "../ClientsTable";

export function RecentLocations() {
    return (
        <div className="p-5 rounded-lg shadow-sm bg-background">
            <div className="flex items-center gap-x-2">
                <CustomIcon icon={Building} />
                <p className="text-xl">Last customers</p>
            </div>
            <div>
                <ClientsTable />
            </div>
        </div>
    )
}
