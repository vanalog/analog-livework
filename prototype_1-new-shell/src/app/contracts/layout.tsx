"use client";

import React from "react";
import DashboardLayout from "@/components/layout/dashboard";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default Layout;
