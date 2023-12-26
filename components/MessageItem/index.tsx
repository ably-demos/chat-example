import { FontBoldIcon, FontItalicIcon } from "@radix-ui/react-icons"
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group"
import { formatRelative } from "date-fns"
import { UnderlineIcon } from "lucide-react"

import { Message, MessagePart } from "@/types/temp"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

const renderMessagePart = (messagePart: MessagePart) => {
  if (messagePart.type === "text") {
    return messagePart.content.text
  }
  if (messagePart.type === "plainLink") {
    return <a href={messagePart.content.link}>{messagePart.content.link}</a>
  }
  if (messagePart.type === "textLink") {
    return <a href={messagePart.content.link}>{messagePart.content.text}</a>
  }
  if (messagePart.type === "mention") {
    return (
      <a href={`https://ably.com/${messagePart.content.userId}`}>
        {messagePart.content.name}
      </a>
    )
  }

  return ""
}

const getPartKey = (messagePart: MessagePart) => {
  if (messagePart.type === "text") {
    return messagePart.content.text
  }
  if (messagePart.type === "plainLink") {
    return messagePart.content.link
  }
  if (messagePart.type === "textLink") {
    return messagePart.content.link
  }
  if (messagePart.type === "mention") {
    return messagePart.content.userId
  }

  return ""
}

type MessageItemProps = {
  message: Message
  username: string
  color?: string
}

const MessageItem = ({ message, username, color }: MessageItemProps) => {
  console.log(message)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <li key={message.created_at}>
            <article className="inline-flex">
              <h3 style={{ color }} className="mr-2">
                {username}
              </h3>
              <p>
                {message.data}
                {/* {message.messageParts.map((messagePart: MessagePart) => (
            <span key={getPartKey(messagePart)}>
              {renderMessagePart(messagePart)}
            </span>
          ))} */}
              </p>
            </article>
          </li>
        </TooltipTrigger>
        <TooltipContent>
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <FontBoldIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <FontItalicIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="strikethrough"
              aria-label="Toggle strikethrough"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default MessageItem
