import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Message, Reaction } from "@ably-labs/chat"
import { PopoverContent } from "@radix-ui/react-popover"
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group"
import clsx from "clsx"
import { EmojiStyle } from "emoji-picker-react"
import { Laugh, Pencil, Reply, SmilePlusIcon, Trash2 } from "lucide-react"

import { useKeyboardDown } from "@/hooks/useKeyboardDown"
import { useOutsideAlerter } from "@/hooks/useOutsideAlerter"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import EmojiPicker from "@/components/EmojiPicker"

import Emoji from "../Emoji"
import { Button } from "../ui/button"
import { Popover, PopoverAnchor, PopoverTrigger } from "../ui/popover"
import MessageReactions from "./MessageReactions"

function getUserColor(username: string) {
  const hue = stringToHue(username)
  const saturation = 90 // Keeping saturation & lightness constant
  const lightness = 50
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function stringToHue(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash % 360
}

const hasReactions = (message: Message) => {
  return Object.entries(message.reactions.counts).some(
    ([, count]) => count > 0,
    false
  )
}

type MessageItemProps = {
  message: Message
  username: string
  onAddReaction: (messageId: string, unicode: string) => void
  onRemoveReaction: (messageId: string, unicode: string) => void
  onEditClick: (messageId: string, content: string) => void
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

  const handleEscape = useCallback(() => setOpen(false), [setOpen])

  const itemRef = useRef(null)
  useKeyboardDown("Escape", handleEscape)
  useOutsideAlerter(itemRef, handleEscape)

  const handleAddReaction = useCallback(
    (unicode: string) => {
      setOpen(false)
      onAddReaction(message.id, unicode)
    },
    [message.id, onAddReaction]
  )

  const handleRemoveReaction = useCallback(
    (unicode: string) => onRemoveReaction(message.id, unicode),
    [message.id, onRemoveReaction]
  )

  const handleEdit = useCallback(
    () => onEditClick(message.id, message.content),
    [message.content, message.id, onEditClick]
  )

  const handleDelete = useCallback(
    () => onDeleteClick(message.id),
    [message.id, onDeleteClick]
  )

  const handleOpenPicker = useCallback(() => setOpen(true), [])

  const showReactions = useMemo(() => hasReactions(message), [message])

  const color = getUserColor(message.client_id)
  const isUsersMessage = message?.client_id === username

  return (
    <Popover open={open}>
      <Tooltip>
        <li className="w-full" ref={itemRef}>
          <TooltipTrigger asChild>
            <PopoverAnchor asChild>
              <p className="space-x-3 rounded-sm px-2 py-1 leading-6 hover:bg-muted">
                <span style={{ color }} className="font-bold">
                  {message.client_id}
                </span>
                <span>{message.content}</span>
              </p>
            </PopoverAnchor>
          </TooltipTrigger>
          {showReactions ? (
            <MessageReactions
              message={message}
              onAdd={handleAddReaction}
              onRemove={handleRemoveReaction}
              onAddClick={handleOpenPicker}
            />
          ) : null}
        </li>
        <TooltipContent className="border bg-background p-2">
          <ToggleGroup type="multiple" className="flex items-center space-x-4">
            <PopoverTrigger asChild>
              <ToggleGroupItem
                value={"add-reaction"}
                aria-label={"Add Reaction"}
                onClick={handleOpenPicker}
                className="text-gray-400"
              >
                <Laugh size="18" />
              </ToggleGroupItem>
            </PopoverTrigger>
            <ToggleGroupItem
              value={"reply"}
              aria-label={"reply"}
              title="Coming soon"
              className="text-gray-400"
            >
              <Reply size="18" />
            </ToggleGroupItem>
            {isUsersMessage ? (
              <>
                <ToggleGroupItem
                  value={"edit"}
                  aria-label={"edit"}
                  className="text-gray-400"
                  onClick={handleEdit}
                >
                  <Pencil size="18" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={"delete"}
                  aria-label={"delete"}
                  onClick={handleDelete}
                  className="text-gray-400"
                >
                  <Trash2 size="18" />
                </ToggleGroupItem>
              </>
            ) : null}
          </ToggleGroup>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[350px] p-0" ref={itemRef}>
        <EmojiPicker onSelect={handleAddReaction} />
      </PopoverContent>
    </Popover>
  )
}

export default memo(MessageItem)
