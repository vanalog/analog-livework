"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { FileText, Users, Building2, DollarSign, Wallet, ChevronRight, LayoutDashboard, Home, Target } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState } from "react"

const navigationItems = [
  {
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Planning", url: "/planning", icon: Target },
      { title: "Athletes", url: "/beneficiaries", icon: Users },
      { title: "Sponsors", url: "/sponsors", icon: Building2 },
      {
        title: "Contracts",
        icon: FileText,
        subItems: [
          { title: "Active", url: "/contracts/active" },
          { title: "In Review", url: "/contracts/negotiation" },
          { title: "Closed", url: "/contracts/closed" },
        ],
      },
      { title: "Disbursements", url: "/disbursements", icon: DollarSign },
      { title: "Accounts", url: "/accounts", icon: Wallet },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Contracts"])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isContractsActive = pathname.startsWith("/contracts")

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="pl-3 pt-3 pr-2 pb-4">
        <div className="flex items-center justify-center">
          {state === "collapsed" ? (
            <Image
              src="/analog-lockup-dark-diagonal.png"
              alt="Analog Symbol"
              width={40}
              height={40}
              className="transition-all duration-300 ease-in-out object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          ) : (
            <div className="flex items-center -ml-1 transition-all duration-300 ease-in-out">
              <Image
                src="/analog-lockup-dark-diagonal.png"
                alt="Analog Logo"
                width={170}
                height={42}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group, index) => (
          <SidebarGroup key={index}>
            {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.subItems ? (
                      <>
                        <SidebarMenuButton onClick={() => toggleExpanded(item.title)} isActive={isContractsActive}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          <ChevronRight
                            className={`ml-auto h-4 w-4 transition-transform ${
                              expandedItems.includes(item.title) ? "rotate-90" : ""
                            }`}
                          />
                        </SidebarMenuButton>
                        {expandedItems.includes(item.title) && (
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                  <Link href={subItem.url}>{subItem.title}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
