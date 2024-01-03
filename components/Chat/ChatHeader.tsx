import React from "react"
import { InfoIcon, Users } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Separator } from "../ui/separator"

type ChatHeaderProps = {
  title: string
  onlineUserCount: number
}

const ChatHeader = ({ title, onlineUserCount }: ChatHeaderProps) => {
  return (
    <div className="flex flex-col">
      <div className="space-between flex w-full items-center space-x-4">
        <p className="grow text-lg font-medium leading-none">{title}</p>
        <span className="flex items-center text-sm">
          <Users size="16" className="mr-2" />
          {onlineUserCount}
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
                <span className="inline-flex text-destructive-foreground">
                  blocklisted words list <InfoIcon height={"16"} />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  Blocklisted words:
                  <br />
                  cat, dog, shark
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>
      </div>
    </div>
  )
}

export default ChatHeader
