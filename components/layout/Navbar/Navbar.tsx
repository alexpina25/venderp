"use client";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ToggleTheme } from "@/components/ui/ToggleTheme";
import { SidebarRoutes } from "../SidebarRoutes";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  return (
    <nav className="flex items-center px-2 gap-x-4 md:px-6 justify-between w-full bg-background border-b h-20">
      <div className="block xl:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <SidebarRoutes onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="relative w-[300px]">
        <Input placeholder="Search..." className="rounded-lg" />
        <Search strokeWidth={1} className="absolute top-2 right-2" />
      </div>
      {session?.user?.tenant?.name ? (
        <p className="font-semibold text-sm truncate hidden md:block">
          {session.user.tenant.name}
        </p>
      ) : null}
      <div className="flex gap-x-2 items-center">
        <ToggleTheme />
        {session?.user ? (
          <Button variant="ghost" onClick={() => signOut()}>
            Sign out
          </Button>
        ) : null}
      </div>
    </nav>
  );
}
