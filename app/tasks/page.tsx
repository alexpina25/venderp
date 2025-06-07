import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Calendar } from "./components/Calendar";

export default async function TasksPage() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return redirect("/");
  }

  const companies = await db.company.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const events = await db.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <Calendar companies={companies} events={events} />
    </div>
  );
}
