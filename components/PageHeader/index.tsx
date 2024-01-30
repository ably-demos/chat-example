import Link from "next/link"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { ExternalLink } from "lucide-react"

import appConfig from "@/config/app"
import { Button } from "@/components/ui/button"

const PageHeader = () => {
  const { name } = appConfig
  return (
    <header className="w-full border-b bg-background">
      <nav className="container flex h-16 space-x-4 sm:justify-between sm:space-x-0">
        <Link
          href="/"
          className="text-md flex items-center gap-6 space-x-2 font-bold md:gap-10"
        >
          {name}
        </Link>
        <div className="flex items-center justify-end space-x-6">
          <div className="inline-flex items-center space-x-2 text-sm">
            <InfoCircledIcon />
            <span>How to try this demo</span>
          </div>
          <Button asChild variant={"secondary"}>
            <Link href="#" className="items-center space-x-2">
              <span>Chat Docs</span>
              <ExternalLink size={15} />
            </Link>
          </Button>
          <Button asChild>
            <Link href="https://ably.com/sign-up">Sign Up</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default PageHeader
