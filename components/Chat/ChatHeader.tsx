import React from "react"
import { InfoIcon, Users } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ChatHeaderProps = {
  title: string
  userCount: number
}

const ChatHeader = ({ title, userCount }: ChatHeaderProps) => {
  return (
    <div className="flex w-full flex-col">
      <div className="space-between flex w-full items-center space-x-4">
        <p className="grow text-lg font-medium leading-none">{title}</p>
        <span className="flex items-center text-sm">
          <Users size="16" className="mr-2" />
          {userCount}
        </span>
      </div>
      <Separator className="my-4" />
      <div className="flex">
        <p className="content-center text-sm text-muted-foreground">
          Welcome to the chat room! Remember not to use any of the words from
          our{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="flex items-center text-foreground">
                  blocklisted words list <InfoIcon height={"16"} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="border bg-background">
                <p className="text-foreground">
                  Blocklisted words:
                  <br />
                  cat, dog, shark
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>
      </div>
    </div>
  )
}

export default ChatHeader
