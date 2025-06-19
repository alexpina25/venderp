import { LucideIcon } from "lucide-react";

export type SidebarItemProps = {
  item: {
    label: string;
    icon: LucideIcon;
    href: string;
    adminOnly?: boolean;
  };
  key: string;
  onClick?: () => void;
};
