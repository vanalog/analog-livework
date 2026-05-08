import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MenuItemProps } from "./types";

function MenuItem(props: MenuItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={props.url}>
          {props.icon && <props.icon />}
          <span>{props.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export { MenuItem };
