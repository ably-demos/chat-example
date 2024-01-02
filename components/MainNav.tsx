import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import ablyLogo from "@/public/images/ably_logo.png"

import { NavItem } from "@/types/nav"
import appConfig from "@/config/app"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: NavItem[]
}

const MainNav = ({ items }: MainNavProps) => {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image src={ablyLogo.src} alt="Ably Logo" width={24} height={24} />
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
                    "flex items-center text-sm font-medium text-muted-foreground",
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
