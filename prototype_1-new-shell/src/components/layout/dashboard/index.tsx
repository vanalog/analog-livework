"use client";

import React from "react";
import { FileText, Building2, ClipboardList, GraduationCap } from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const items = [
  {
    title: "Athletes",
    icon: ClipboardList,
    url: "/roster",
  },
  {
    title: "Agreements",
    icon: FileText,
    url: "/agreements",
  },
  {
    title: "Sponsors",
    icon: Building2,
    url: "/sponsors",
  },
  {
    title: "Universities",
    icon: GraduationCap,
    url: "/universities",
  },
];

function Layout(props: LayoutProps) {
  return (
    <SidebarProvider>
      <MainNav items={items} />
      <SidebarInset className="min-w-0">
        <SiteHeader />
        <main className="flex-1 p-6">{props.children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;
