"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { UserInfo } from "@/components/users/detail/UserInfo";
import { EditUserModal } from "@/components/users/forms/EditUserModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserDetail extends User {
  center?: { id: string; name: string } | null;
  pos?: { id: string; name: string } | null;
}

async function fetchUserData(id: string): Promise<UserDetail> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) {
    throw new Error("Error fetching user data");
  }
  return res.json();
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData(params.id).then(setUser).catch(console.error);
  }, [params.id]);

  const refreshData = async () => {
    const updated = await fetchUserData(params.id);
    setUser(updated);
  };

  const openEditModal = () => setIsModalOpen(true);
  const closeEditModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="icon">
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Detalle de usuario</h2>
      </div>

      {user && (
        <>
          <EditUserModal
            user={user}
            open={isModalOpen}
            onClose={closeEditModal}
            onSuccess={async () => {
              await refreshData();
              closeEditModal();
            }}
          />
          <UserInfo user={user} onEdit={openEditModal} />
        </>
      )}
    </div>
  );
}
