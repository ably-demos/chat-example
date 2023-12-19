import "@/styles/globals.css"

import { Metadata } from "next"
import { Toaster } from "react-hot-toast";

import appConfig from "@/config/app"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Header from "@/components/Header"
import { ThemeProvider } from "@/components/ThemeProvider"
import ProgressBar from "@/components/ProgressBar";
import ActiveBreakpoint from "@/components/ActiveBreakpoint";

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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
            </div>
            <ActiveBreakpoint />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
