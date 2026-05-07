"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "New Agreement" },
  { href: "/agreements", label: "Agreements" },
  { href: "/settings", label: "Budget Settings" },
]

export function SimpleSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-44 border-r flex-shrink-0">
      <nav className="p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === "/agreements" && pathname.startsWith("/agreements/"))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-2 py-1.5 text-sm transition-colors",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
