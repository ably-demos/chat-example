import { forwardRef, useCallback, useState } from "react"
import { Message, Messages } from "@ably/chat"
import { Pencil, Trash2 } from "lucide-react"

/**
 * Hooks
 */
import { useKeyboardDown } from "@/hooks/useKeyboardDown"
import { useSession } from "@/hooks/useSession"
/**
 * Components
 */
import { Popover, PopoverAnchor } from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  onUpdate: Messages["update"]
  onDelete: Messages["delete"]
}

const MessageItem = forwardRef<HTMLLIElement, MessageItemProps>(
  ({ message, onUpdate, onDelete }, ref) => {
    const [open, setOpen] = useState(false)
    const { username } = useSession()

    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(message.text)

    const handleEscape = useCallback(() => {
      setOpen(false)
      setIsEditing(false)
    }, [])

    useKeyboardDown("Escape", handleEscape)

    const color = getUserColor(message.clientId)
    const isUsersMessage = message?.clientId === username
    const isMessageDeleted = message?.isDeleted

    const handleUpdate = useCallback(
      (message: Message, text: string) => {
        onUpdate(message.serial, message.copy({ text })).catch((error) => {
          console.error("Failed to update message", error)
        })
      },
      [onUpdate]
    )

    const handleDelete = useCallback(
      (message: Message) => {
        onDelete(message).catch((error) => {
          console.error("Failed to delete message", error)
        })
      },
      [onDelete]
    )

    // Start editing
    const startEditing = () => {
      setEditText(message.text)
      setIsEditing(true)
      setOpen(true)
    }

    // Confirm editing
    const saveEdit = () => {
      handleUpdate(message, editText)
      setIsEditing(false)
      setOpen(false)
    }

    // Cancel editing
    const cancelEdit = () => {
      setIsEditing(false)
      setOpen(false)
    }

    return (
      <Popover open={open}>
        <Tooltip>
          <li className="w-full" ref={ref}>
            <TooltipTrigger asChild>
              <PopoverAnchor asChild>
                <p className="space-x-3 rounded-sm px-2 py-1 leading-6 hover:bg-muted">
                  <span style={{ color }} className="font-bold">
                    {message.clientId}
                  </span>
                  {isMessageDeleted ? (
                    <span className="text-gray-400">Message deleted</span>
                  ) : (
                    <span>{message.text}</span>
                  )}
                </p>
              </PopoverAnchor>
            </TooltipTrigger>
          </li>
          {isMessageDeleted || !isUsersMessage ? null : (
            <TooltipContent className="border bg-background p-2">
              {!isEditing ? (
                <ToggleGroup
                  type="multiple"
                  className="flex items-center space-x-4"
                >
                  <ToggleGroupItem
                    value={"edit"}
                    aria-label={"edit"}
                    className="text-gray-400"
                    onClick={startEditing}
                  >
                    <Pencil size="18" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={"delete"}
                    aria-label={"delete"}
                    onClick={() => handleDelete(message)}
                    className="text-gray-400"
                  >
                    <Trash2 size="18" />
                  </ToggleGroupItem>
                </ToggleGroup>
              ) : (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Edit message:
                  </label>
                  <input
                    className="rounded-sm border px-2 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveEdit()
                      }
                    }}
                  />
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      className="rounded-md bg-gray-500 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-md bg-green-500 px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </Popover>
    )
  }
)

MessageItem.displayName = "MessageItem"

export default MessageItem
