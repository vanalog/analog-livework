import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { SimpleSidebar } from "@/components/simple-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Build Contract Schedule",
  description: "Define contract parameters to generate a payment schedule",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          {/* Fixed theme toggle in top-right corner */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <div className="flex min-h-screen">
            <SimpleSidebar />
            <main className="flex-1 bg-background">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
