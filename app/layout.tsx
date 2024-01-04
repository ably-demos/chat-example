import "@/styles/globals.css"

import { Metadata } from "next"
import { ThemeProvider } from "@/providers/ThemeProvider"

import appConfig from "@/config/app"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
/**
 * Components
 */
import ActiveBreakpoint from "@/components/ActiveBreakpoint"
import PageHeader from "@/components/PageHeader"

export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s - ${appConfig.name}`,
  },
  description: appConfig.description,
  metadataBase: new URL("https://chat-app.ably.com"),
}

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen max-w-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full min-h-screen w-full flex-col">
            <PageHeader />
            <div className="flex flex-1">{children}</div>
          </div>
          <ActiveBreakpoint />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
