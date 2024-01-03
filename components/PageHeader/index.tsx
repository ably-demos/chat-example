import Image from "next/image"
import Link from "next/link"
import ablyLogo from "@/public/images/ably_logo.png"

import appConfig from "@/config/app"
import ThemeToggle from "@/components/ThemeToggle"

const PageHeader = () => {
  const { name } = appConfig
  return (
    <header className="w-full border-b bg-background">
      <nav className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={ablyLogo.src} alt="Ably Logo" width={24} height={24} />
            <span className="inline-block font-bold">{name}</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-1">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default PageHeader
