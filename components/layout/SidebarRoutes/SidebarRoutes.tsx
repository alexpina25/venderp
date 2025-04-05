"use client";

import { SidebarItem } from "@/components/layout/SidebarItem";
import { Separator } from "@/components/ui/separator";
import { sidebarSections } from "./SidebarRoutes.data";

export function SidebarRoutes() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {sidebarSections.map((section) => (
          <div key={section.title} className="p-2 md:p-6">
            <p className="text-slate-500 mb-2 text-xs uppercase tracking-wide">
              {section.title}
            </p>
            {section.items.map((item) => (
              <SidebarItem key={item.label} item={item} />
            ))}
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
