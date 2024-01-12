import { memo, useState } from "react"
import { Message } from "@ably-labs/chat"
import { PopoverContent } from "@radix-ui/react-popover"
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group"
import { Transition } from "@tailwindui/react"
import { Laugh, Pencil, Reply, Star, Trash2 } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import EmojiPicker from "@/components/EmojiPicker"

import EmojiButton from "../EmojiButton"
import { Popover, PopoverAnchor, PopoverTrigger } from "../ui/popover"

type MessageItemProps = {
  message: Message
  username: string
  onAddReaction: (emoji: string) => void
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
  onAddReaction,
  onEdit: handleEdit,
  onDelete: handleDelete,
}: MessageItemProps) => {
  const color = getUserColor(username)
  const isOwnMessage = message.client_id === username
  const [pickerOpen, setPickerOpen] = useState(false)

  const handleSelectEmoji = (emoji: string) => {
    onAddReaction(emoji)
    setPickerOpen(false)
  }

  const reactions = message.reactions.counts

  return (
    <>
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverAnchor asChild>
                <li
                  className="mx-2 flex w-full rounded-sm px-2 py-1 hover:bg-muted"
                  key={message.created_at}
                >
                  <h3 style={{ color }} className="pr-2">
                    {username}
                  </h3>
                  <p>{message.content}</p>
                  <div className="flex items-center">
                    {Object.keys(reactions).map((reaction) => (
                      <>
                        <p className="pr-2">{reaction}</p>
                        <p>{reactions[reaction]}</p>
                      </>
                    ))}
                  </div>
                </li>
              </PopoverAnchor>
            </TooltipTrigger>
            <TooltipContent className="border bg-background">
              <ToggleGroup type="multiple">
                <PopoverTrigger asChild>
                  <ToggleGroupItem
                    value={"add-reaction"}
                    aria-label={"Add Reaction"}
                    className="mx-1"
                    onClick={() => setPickerOpen((prev) => !prev)}
                  >
                    <Laugh size="16" />
                  </ToggleGroupItem>
                </PopoverTrigger>
                <ToggleGroupItem
                  value={"reply"}
                  aria-label={"reply"}
                  className="mx-1"
                >
                  <Reply size="16" />
                </ToggleGroupItem>
                {/* {isOwnMessage ? ( */}
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
                {/*  ) : ( */}
                <>
                  <ToggleGroupItem
                    value={"favourite"}
                    aria-label={"favourite"}
                    className="mx-1"
                  >
                    <Star size="16" />
                  </ToggleGroupItem>
                </>
                {/* )} */}
              </ToggleGroup>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-[350px] p-0">
          <EmojiPicker onSelect={handleSelectEmoji} />
        </PopoverContent>
      </Popover>
    </>
  )
}

export default memo(MessageItem)
