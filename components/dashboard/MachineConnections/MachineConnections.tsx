import { CustomIcon } from "@/components/ui/CustomIcon"
import { List } from "lucide-react"
import { MachineTable } from "@/components/machines/MachineTable"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"


export async function MachineConnections() {
    const session = await getServerAuthSession()
    const tenantId = session?.user?.tenant?.id

    const machines = await db.machine.findMany({
        where: { center: { tenantId } },
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
