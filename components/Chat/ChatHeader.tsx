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
  name: string
  description: string
  onLeave: () => void
  onInviteClick: () => void
}

const ChatHeader = ({
  name,
  description,
  onLeave,
  onInviteClick,
}: ChatHeaderProps) => {
  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              name
            )}&rounded=true&background=random`}
            alt="Image"
          />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="ml-auto rounded-full"
              onClick={onInviteClick}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Invite</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>Invite</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}

export default ChatHeader
