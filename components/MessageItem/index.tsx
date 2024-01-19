import { memo, useCallback, useState } from "react"
import { Message } from "@ably-labs/chat"
import { User } from "@prisma/client"
import { PopoverContent } from "@radix-ui/react-popover"
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group"
import clsx from "clsx"
import { Laugh, Pencil, Reply, Star, Trash2 } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import EmojiPicker from "@/components/EmojiPicker"

import Emoji from "../Emoji"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Popover, PopoverAnchor, PopoverTrigger } from "../ui/popover"

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

type MessageItemProps = {
  message: Message
  username: string
  onAddReaction: (messageId: string, unicode: string) => void
  onRemoveReaction: (messageId: string, unicode: string) => void
  onEditClick: (messageId: string) => void
  onDeleteClick: (messageId: string) => void
}

const MessageItem = ({
  message,
  username,
  onAddReaction,
  onRemoveReaction,
  onEditClick,
  onDeleteClick,
}: MessageItemProps) => {
  const [open, setOpen] = useState(false)
  const isOwnMessage = message?.client_id === username

  const handleAddReaction = useCallback(
    (unicode: string) => {
      setOpen(false)
      onAddReaction(message.id, unicode)
    },
    [message.id, onAddReaction]
  )

  const handleRemoveReaction = useCallback(
    (unicode: string) => {
      setOpen(false)
      onRemoveReaction(message.id, unicode)
    },
    [message.id, onRemoveReaction]
  )

  const handleEdit = useCallback(() => {
    onEditClick(message.id)
  }, [message.id, onEditClick])

  const handleDelete = useCallback(() => {
    setOpen(false)
    onDeleteClick(message.id)
  }, [message.id, onDeleteClick])

  if (!message) return null
  if (!message.client_id) {
    console.error("Message client_id is null", message)
    return null
  }

  const color = getUserColor(message.client_id)
  return (
    <Popover open={open}>
      <TooltipProvider>
        <Tooltip>
          <li className="w-full">
            <TooltipTrigger asChild>
              <PopoverAnchor asChild>
                <p className="rounded-sm px-2 py-1 hover:bg-muted">
                  <span style={{ color }} className="pr-2">
                    {message.client_id}{" "}
                  </span>
                  <span>{message.content}</span>
                </p>
              </PopoverAnchor>
            </TooltipTrigger>
            {!!message.reactions.counts ? (
              <div className="flex items-center space-x-1 px-2">
                {Object.entries(message.reactions.counts)
                  ?.filter(([_, count]) => !!count)
                  .map(([reaction, count]) => (
                    <Button
                      key={reaction}
                      className={clsx(
                        "rounded-full h-6 flex justify-between content-between py-0 px-2 space-x-1.5 bg-secondary text-secondary-foreground hover:bg-primary/90 hover:text-secondary",
                        message.reactions.mine.some(
                          (r) => r.type === reaction
                        ) && "border border-blue-500"
                      )}
                      onClick={() => {
                        if (
                          message.reactions.mine.some(
                            (r) => r.type === reaction
                          )
                        ) {
                          handleRemoveReaction(reaction)
                        } else {
                          handleAddReaction(reaction)
                        }
                      }}
                    >
                      <Emoji size={14} unified={reaction} />
                      <span className="text-xs">{count}</span>
                    </Button>
                  ))}
              </div>
            ) : null}
          </li>
          <TooltipContent className="border bg-background p-1">
            <ToggleGroup type="multiple">
              <PopoverTrigger asChild>
                <ToggleGroupItem
                  value={"add-reaction"}
                  aria-label={"Add Reaction"}
                  onClick={() => setOpen((prev) => !prev)}
                  className="p-2"
                >
                  <Laugh size="16" />
                </ToggleGroupItem>
              </PopoverTrigger>
              <ToggleGroupItem
                value={"reply"}
                aria-label={"reply"}
                title="Coming soon"
                disabled
              >
                <Reply size="16" />
              </ToggleGroupItem>
              {isOwnMessage ? (
                <>
                  <ToggleGroupItem
                    value={"edit"}
                    aria-label={"edit"}
                    className="p-2"
                    onClick={handleEdit}
                  >
                    <Pencil size="16" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={"delete"}
                    aria-label={"delete"}
                    onClick={handleDelete}
                    title="Coming soon"
                    className="p-2"
                  >
                    <Trash2 size="16" />
                  </ToggleGroupItem>
                </>
              ) : null}
            </ToggleGroup>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-[350px] p-0">
        <EmojiPicker onSelect={handleAddReaction} />
      </PopoverContent>
    </Popover>
  )
}
// <ToggleGroupItem
//   value={"favourite"}
//   aria-label={"favourite"}
//   asChild
//   disabled
//   title="Coming soon"
// >
//   <Star size="16" />
// </ToggleGroupItem>

export default memo(MessageItem)
