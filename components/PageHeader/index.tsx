import Link from "next/link"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { ExternalLink } from "lucide-react"

import appConfig from "@/config/app"
import { Button } from "@/components/ui/button"

import styles from "./PageHeader.module.css"

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
          <div className="relative inline-flex items-center space-x-2 text-sm">
            <InfoCircledIcon />
            <span className={styles["hover-target"]}>How to try this demo</span>
            <div className={styles["hidden-text-box"]}>
              Open this page in multiple windows or share the URL with your team
              to try out the live app.
            </div>
          </div>
          <Button asChild variant={"secondary"}>
            <Link
              href="https://ably.com/docs/products/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="items-center space-x-2"
            >
              <span>Chat Docs</span>
              <ExternalLink size={15} />
            </Link>
          </Button>
          <Button asChild>
            <Link
              target="_blank"
              href="https://github.com/ably-demos/chat-example"
            >
              Github
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default PageHeader
