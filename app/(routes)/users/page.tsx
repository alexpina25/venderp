import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserTable } from "@/components/users/UserTable";
import { NewUserModal } from "@/components/users/forms/NewUserModal";

export default async function UsersPage() {
  const session = await getServerAuthSession();
  const userId = session?.user?.id;

  const current = userId
    ? await db.user.findUnique({ where: { id: userId } })
    : null;

  if (!current || current.role !== "TENANT_ADMIN" || !current.tenantId) {
    redirect("/dashboard");
  }

  const users = await db.user.findMany({
    where: { tenantId: current.tenantId },
    orderBy: { name: "asc" },
    select: { id: true, email: true, name: true, role: true },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <NewUserModal />
      </div>
      <UserTable data={users} />
    </div>
  );
}
