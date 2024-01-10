import { memo } from "react"
import { Message } from "@ably-labs/chat"
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group"
import { Laugh, Pencil, Reply, Star, Trash2 } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type MessageItemProps = {
  message: Message
  username: string
  onAddReaction: () => void
  onEdit: () => void
  onDelete: () => void
}

function getUserColor(username: string) {
  const hue = stringToHue(username)
  const saturation = 50 // Keeping saturation & lightness constant
  const lightness = 60
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function stringToHue(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash % 360
}

const MessageItem = ({
  message,
  username,
  onAddReaction: handleAddReaction,
  onEdit: handleEdit,
  onDelete: handleDelete,
}: MessageItemProps) => {
  const color = getUserColor(username)
  const isOwnMessage = message.client_id === username
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <li
            className="mx-2 flex w-full rounded-sm px-2 py-1 hover:bg-muted"
            key={message.created_at}
          >
            <h3 style={{ color }} className="pr-2">
              {username}
            </h3>
            <p>{message.content}</p>
          </li>
        </TooltipTrigger>
        <TooltipContent className="border bg-background">
          <ToggleGroup type="multiple">
            <ToggleGroupItem
              value={"add-reaction"}
              aria-label={"Add Reaction"}
              className="mx-1"
            >
              {/* <Emoji unified="1f604"  siz/> */}
              <Laugh size="16" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value={"reply"}
              aria-label={"reply"}
              className="mx-1"
            >
              <Reply size="16" />
            </ToggleGroupItem>
            {isOwnMessage ? (
              <>
                <ToggleGroupItem
                  value={"edit"}
                  aria-label={"edit"}
                  className="mx-1"
                  onClick={handleEdit}
                >
                  <Pencil size="16" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={"delete"}
                  aria-label={"delete"}
                  className="mx-1"
                  onClick={handleDelete}
                >
                  <Trash2 size="16" />
                </ToggleGroupItem>
              </>
            ) : (
              <ToggleGroupItem
                value={"favourite"}
                aria-label={"favourite"}
                className="mx-1"
              >
                <Star size="16" />
              </ToggleGroupItem>
            )}
          </ToggleGroup>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default memo(MessageItem)
