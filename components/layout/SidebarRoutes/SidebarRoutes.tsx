"use client";

import { SidebarItem } from "@/components/layout/SidebarItem";
import { Separator } from "@/components/ui/separator";
import { sidebarSections } from "./SidebarRoutes.data";
import { useSession } from "next-auth/react";

type SidebarRoutesProps = {
  onNavigate?: () => void;
};

export function SidebarRoutes({ onNavigate }: SidebarRoutesProps) {
    const { data: session } = useSession();
  const role = session?.user?.role;
  const sections = sidebarSections.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.adminOnly || role === "TENANT_ADMIN"
    ),
  }));

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {sections.map((section) => (
          <div key={section.title} className="p-2 md:p-6">
            <p className="text-slate-500 mb-2 text-xs uppercase tracking-wide">
              {section.title}
            </p>
            {section.items.map((item) => (
              <SidebarItem
                key={item.label}
                item={item}
                onClick={onNavigate}
              />
            ))}
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
