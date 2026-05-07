import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavigation } from "@/components/top-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Analog - Financial Infrastructure Platform",
  description: "Modern financial infrastructure for athletes, sponsors, and universities",
    generator: 'v0.app'
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "12rem",
          "--sidebar-width-mobile": "12rem",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNavigation />
          <main className="flex-1 px-6 py-6 bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDev = process.env.NODE_ENV === "development"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {isDev && (
          <div className="fixed top-0 left-0 right-0 z-[9999] bg-orange-500 text-white text-xs text-center h-[15px] flex items-center justify-center">
            Analog Dev Environment
          </div>
        )}
        <ThemeProvider>
          <div className={isDev ? "pt-[15px]" : ""}>
            <LayoutContent>{children}</LayoutContent>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
