import { LucideIcon } from "lucide-react";

export interface MenuItemProps {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface CollapsibleMenuItemProps {
  title: string;
  icon: LucideIcon;
  subItems: MenuItemProps[];
}
