import { Building } from "lucide-react";

import { CustomIcon } from "@/components/ui/CustomIcon";
import { CentersTable } from "../CentersTable";

export function RecentPos() {
    return (
        <div className="p-5 rounded-lg shadow-sm bg-background">
            <div className="flex items-center gap-x-2">
                <CustomIcon icon={Building} />
                <p className="text-xl">Last centers</p>
            </div>
            <div>
                <CentersTable />
            </div>
        </div>
    )
}
