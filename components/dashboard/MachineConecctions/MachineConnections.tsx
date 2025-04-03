import { CustomIcon } from "@/components/CustomIcon"
import { List } from "lucide-react"
import { MachinesTable } from "../MachinesTable"


export function MachineConnections() {
    return (
        <div className="shadow-sm bg-background rounded-lg p-5 flex-1">
            <div className="flex gap-x-2 items-center">
                <CustomIcon icon={List} />
                <p className="text-xl">List of integrations</p>
            </div>
            <MachinesTable />
        </div>
    )
}
