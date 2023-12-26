import React from "react"
import { Plus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ChatHeaderProps = {
  channelName: string
}

const ChatHeader = ({ channelName }: ChatHeaderProps) => {
  return (
    <>
      <div className="flex items-center space-x-4">
        <p className="text-lg font-medium leading-none">{channelName}</p>
      </div>
    </>
  )
}

export default ChatHeader
