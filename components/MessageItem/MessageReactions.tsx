import React from "react"
import { Message, Reaction } from "@ably-labs/chat"
import { PopoverTrigger } from "@radix-ui/react-popover"
import clsx from "clsx"
import { SmilePlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import ReactionComponent from "../Reaction"

const isReactionListed = (reaction: string, reactions: Reaction[] = []) => {
  return reactions.some((r) => r.type === reaction)
}

type MessageReactionsProps = {
  message: Message
  onAdd: (unicode: string) => void
  onRemove: (reactionId: string) => void
  onAddClick: () => void
}

const MessageReactions = ({
  message,
  onAdd,
  onRemove,
  onAddClick,
}: MessageReactionsProps) => {
  // Review: Should be handled by the SDK
  const { counts, mine } = message.reactions ?? { counts: {}, mine: [] }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max items-center space-x-1.5 px-2">
        {Object.entries(counts)
          ?.filter(([_, count]) => !!count)
          .map(([reaction, count]) => (
            <Button
              key={reaction}
              className={clsx(
                "rounded-full h-6 flex justify-between content-between py-0 px-2 space-x-1.5 bg-muted text-muted-foreground shadow-none hover:bg-gray-200",
                mine.some((r) => r.type === reaction) &&
                  "border border-blue-500 bg-blue-100/90 hover:bg-blue-300/90 text-primary"
              )}
              onClick={() =>
                isReactionListed(reaction, mine)
                  ? onRemove(reaction)
                  : onAdd(reaction)
              }
            >
              <ReactionComponent size={18} unified={reaction} />
              <span className="text-xs">{count}</span>
            </Button>
          ))}
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="size-6 rounded-full bg-muted hover:bg-gray-200"
            onClick={onAddClick}
          >
            <SmilePlusIcon size="17" className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default MessageReactions
