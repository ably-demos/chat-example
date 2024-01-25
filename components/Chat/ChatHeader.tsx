import React from "react"
import { InfoIcon, Users } from "lucide-react"

import { useSimulatedUserCount } from "@/hooks/useSimulatedUserCount"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ChatHeaderProps = {
  title?: string
}

const ChatHeader = ({ title = "Chat Room" }: ChatHeaderProps) => {
  const userCount = useSimulatedUserCount()

  return (
    <div className="flex w-full flex-col">
      <div className="space-between flex w-full items-center space-x-4">
        <p className="grow text-lg font-medium leading-none">{title}</p>
        <p className="flex items-center text-sm">
          <Users size={16} className="mr-2 text-muted-foreground" />
          <span className="min-w-8 font-semibold">{userCount}</span>
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex">
        <p className="content-center text-sm text-muted-foreground">
          Welcome to the chat room! Remember not to use any of the words from
          our{" "}
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
        </p>
      </div>
    </div>
  )
}

export default ChatHeader
