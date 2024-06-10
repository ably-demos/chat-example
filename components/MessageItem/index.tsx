import { useCallback, useRef, useState } from "react"
import { Message } from "@ably/chat"

/**
 * Hooks
 */
import { useKeyboardDown } from "@/hooks/useKeyboardDown"
import { useOutsideAlerter } from "@/hooks/useOutsideAlerter"
/**
 * Components
 */
import { Popover, PopoverAnchor } from "@/components/ui/popover"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"

function getUserColor(username: string) {
  const hue = stringToHue(username)
  const saturation = 90 // Keeping saturation & lightness constant
  const lightness = 50
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function stringToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return hue < 0 ? hue + 360 : hue
}

export type MessageItemProps = {
  message: Message
}

const MessageItem = ({ message }: MessageItemProps) => {
  const [open, setOpen] = useState(false)

  const handleEscape = useCallback(() => setOpen(false), [])

  const itemRef = useRef(null)
  useKeyboardDown("Escape", handleEscape)
  useOutsideAlerter(itemRef, handleEscape)

  const color = getUserColor(message.clientId)

  return (
    <Popover open={open}>
      <Tooltip>
        <li className="w-full" ref={itemRef}>
          <TooltipTrigger asChild>
            <PopoverAnchor asChild>
              <p className="space-x-3 rounded-sm px-2 py-1 leading-6 hover:bg-muted">
                <span style={{ color }} className="font-bold">
                  {message.clientId}
                </span>
                <span>{message.text}</span>
              </p>
            </PopoverAnchor>
          </TooltipTrigger>
        </li>
      </Tooltip>
    </Popover>
  )
}

export default MessageItem
