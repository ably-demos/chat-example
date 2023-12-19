import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import appConfig from "@/config/app"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/Icons"

interface MainNavProps {
  items?: NavItem[]
}

const MainNav = ({ items }: MainNavProps) => {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Logo className="h-6 w-6" />
        <span className="inline-block font-bold">{appConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item) =>
              item.href && (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-muted-foreground flex items-center text-sm font-medium",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}

export default MainNav
