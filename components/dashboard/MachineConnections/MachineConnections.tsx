import { CustomIcon } from "@/components/ui/CustomIcon"
import { List } from "lucide-react"
import { MachineTable } from "@/components/machines/MachineTable"
import { db } from "@/lib/db"


export async function MachineConnections() {
    const machines = await db.machine.findMany({
        include: { pos: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
    })

    return (
        <div className="shadow-sm bg-background rounded-lg p-5 flex-1">
            <div className="flex gap-x-2 items-center">
                <CustomIcon icon={List} />
                <p className="text-xl">List of integrations</p>
            </div>
            <MachineTable data={machines} />
        </div>
    )
}
