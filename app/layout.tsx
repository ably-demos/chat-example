import "@/styles/globals.css"

import { Metadata } from "next"

import appConfig from "@/config/app"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
/**
 * Components
 */
import ActiveBreakpoint from "@/components/ActiveBreakpoint"
import PageHeader from "@/components/PageHeader"
import { SessionProvider } from "@/components/SessionProvider"
import { ThemeProvider } from "@/components/ThemeProvider"

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
          <div className="flex size-full min-h-screen flex-col">
            <PageHeader />
            <SessionProvider>
              <div className="flex flex-1">{children}</div>
            </SessionProvider>
          </div>
          <ActiveBreakpoint />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
