"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search } from "lucide-react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"

export function TopNavigation() {
  const { state, toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center pl-4 pr-4 gap-4">
        {state === "collapsed" ? (
          <button
            onClick={toggleSidebar}
            className="cursor-pointer p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Expand sidebar"
          >
            <Image
              src="/analog-symbol.svg"
              alt="Analog Symbol"
              width={28}
              height={28}
              className="w-7 h-7 transition-all duration-300 ease-in-out dark:invert"
              style={{
                height: "auto",
              }}
              priority
            />
          </button>
        ) : (
          <SidebarTrigger />
        )}

        <div className="flex-1 flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search or jump to..." className="pl-10 bg-muted/50" />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>CS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Carl Sagan</p>
                  <p className="text-xs leading-none text-muted-foreground">carl@analog.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Account</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // In a real app, this would call Auth0 logout
                  window.location.href = "/"
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
