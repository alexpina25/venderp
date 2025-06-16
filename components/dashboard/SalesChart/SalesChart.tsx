"use client"

import { TrendingUp } from "lucide-react"
import {
    Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
export type SalesData = {
    label: string
    coins: number
    cards: number
}

interface SalesChartProps {
    data: SalesData[]
}

export function SalesChart({ data }: SalesChartProps) {
    const total = data.reduce((acc, d) => acc + d.coins + d.cards, 0)
    const first = data[0] ? data[0].coins + data[0].cards : 0
    const last = data[data.length - 1] ? data[data.length - 1].coins + data[data.length - 1].cards : 0
    const diff = first ? ((last - first) / first) * 100 : 0

    return (
        <div className="mt-5">
            <p className="text-3xl mb-3">{total.toLocaleString()}</p>
            <div className="flex gap-x-5 mb-5">
                <div className="flex items-center gap-2 px-3 text-md bg-[#16C8C7] text-white rounded-xl w-fit">
                    {diff.toFixed(1)}%
                    <TrendingUp strokeWidth={1} className="h-4 w-4" />
                </div>
                <p className="text-slate-500">{(last - first).toFixed(0)} increased</p>
            </div>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={730}
                        height={250}
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#887CFD" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#887CFD" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="coins"
                            stroke="#887CFD"
                            fillOpacity={1}
                            fill="url(#colorUv)"
                        />
                        <Area
                            type="monotone"
                            dataKey="cards"
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#colorPv)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
