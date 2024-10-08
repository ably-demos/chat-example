import "@/styles/globals.css"

import { Metadata } from "next"
import { SessionProvider } from "@/providers/SessionProvider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import appConfig from "@/config/app"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
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
  // TODO: Change this to an env variable
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
          "h-screen max-w-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SessionProvider>
          <TooltipProvider>
            <div className="flex size-full h-screen flex-col">
              <PageHeader />
              {children}
            </div>
          </TooltipProvider>
        </SessionProvider>
        <ActiveBreakpoint />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

export default RootLayout
