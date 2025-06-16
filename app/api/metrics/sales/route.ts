import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { format, subDays, subWeeks, subMonths, subYears, startOfWeek, startOfMonth, startOfYear } from "date-fns";

export async function GET(req: NextRequest) {
  const group = req.nextUrl.searchParams.get("group") || "month";
  const now = new Date();

  let start: Date;
  let formatter: (date: Date) => string;

  switch (group) {
    case "day":
      start = subDays(now, 30);
      formatter = (d) => format(d, "yyyy-MM-dd");
      break;
    case "week":
      start = subWeeks(now, 12);
      formatter = (d) => format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-'W'II");
      break;
    case "month":
      start = subMonths(now, 11);
      formatter = (d) => format(startOfMonth(d), "yyyy-MM");
      break;
    case "year":
      start = subYears(now, 4);
      formatter = (d) => format(startOfYear(d), "yyyy");
      break;
    default:
      return NextResponse.json({ error: "Invalid group" }, { status: 400 });
  }

  const sales = await db.sale.findMany({
    where: { timestamp: { gte: start } },
  });

  const map: Record<string, { label: string; coins: number; cards: number }> = {};

  for (const sale of sales) {
    const label = formatter(sale.timestamp);
    if (!map[label]) map[label] = { label, coins: 0, cards: 0 };
    if (sale.method === "CARD") map[label].cards += sale.price;
    else map[label].coins += sale.price;
  }

  const data = Object.values(map).sort((a, b) => a.label.localeCompare(b.label));

  return NextResponse.json(data);
}