import { CustomIcon } from "@/components/ui/CustomIcon"
import { BarChart } from "lucide-react"
import { SalesChart } from "../SalesChart"
import { db } from "@/lib/db"

export async function RefillStats() {
    const sales = await db.sale.findMany()

    const map: Record<string, { year: string; coins: number; cards: number }> = {}

    for (const sale of sales) {
        const year = sale.timestamp.getFullYear().toString()
        if (!map[year]) map[year] = { year, coins: 0, cards: 0 }
        if (sale.method === "CARD") {
            map[year].cards += sale.price
        } else {
            map[year].coins += sale.price
        }
    }

    const data = Object.values(map).sort((a, b) => a.year.localeCompare(b.year))

    return (
        <div className="shadow-sm bg-background rounded-lg p-5">
            <div className="flex gap-x-2 items-center">
                <CustomIcon icon={BarChart} />
                <p className="text-xl">Sales Distribution</p>
            </div>
            <SalesChart data={data} />
        </div>
    )
}
