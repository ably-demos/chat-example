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

  const color = getUserColor(message.client_id)
  return (
    <Popover open={open}>
      <TooltipProvider>
        <Tooltip>
          <li className="w-full">
            <TooltipTrigger asChild>
              <PopoverAnchor asChild>
                <div className="flex rounded-sm py-1 px-2 hover:bg-muted">
                  <h3 style={{ color }} className="pr-2">
                    {message.client_id}
                  </h3>
                  <p>{message.content}</p>
                </div>
              </PopoverAnchor>
            </TooltipTrigger>
            <div className="flex items-center">
              {Object.entries(message.reactions.counts)?.map(
                ([reaction, count]) => (
                  <Button
                    key={reaction}
                    className={clsx(
                      "relative flex flex-col h-8 w-8",
                      message.reactions.mine.some((r) => r.type === reaction) &&
                        "bg-white"
                    )}
                    variant={"ghost"}
                  >
                    <p className="">
                      <Emoji size={18} unified={reaction} />
                    </p>
                    <Badge
                      className="absolute -bottom-1/2 z-40 rounded-full px-1.5 py-0.5 text-xs"
                      variant="outline"
                    >
                      {count}
                    </Badge>
                  </Button>
                )
              )}
            </div>
          </li>
          <TooltipContent className="border bg-background p-1">
            <ToggleGroup type="multiple">
              <PopoverTrigger asChild>
                <ToggleGroupItem
                  value={"add-reaction"}
                  aria-label={"Add Reaction"}
                >
                  <Button
                    variant="ghost"
                    color="primary"
                    size="sm"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    <Laugh size="16" />
                  </Button>
                </ToggleGroupItem>
              </PopoverTrigger>
              <ToggleGroupItem
                value={"reply"}
                aria-label={"reply"}
                disabled={true}
              >
                <Button variant="ghost" color="primary" size="sm" disabled>
                  <Reply size="16" />
                </Button>
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
                  <ToggleGroupItem value={"delete"} aria-label={"delete"}>
                    <Button
                      variant="ghost"
                      color="primary"
                      size="sm"
                      onClick={handleDelete}
                      title="Coming soon"
                    >
                      <Trash2 size="16" />
                    </Button>
                  </ToggleGroupItem>
                </>
              ) : (
                <ToggleGroupItem
                  value={"favourite"}
                  aria-label={"favourite"}
                  asChild
                >
                  <Button
                    variant="ghost"
                    color="primary"
                    size="sm"
                    disabled
                    title="Coming soon"
                  >
                    <Star size="16" />
                  </Button>
                </ToggleGroupItem>
              )}
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

export default memo(MessageItem)
