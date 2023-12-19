import { formatRelative } from "date-fns"

import { Message, MessagePart } from "@/types/temp"

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
  avatar: string
}

const MessageItem = ({ message, username, avatar }: MessageItemProps) => {
  return (
    <li key={message.created_at}>
      <aside style={{ background: avatar }}>username</aside>
      <article>
        <h3>
          {username}
          <time>
            {formatRelative(new Date(message.created_at), new Date())}
          </time>
        </h3>
        <p>
          {message.messageParts.map((messagePart: MessagePart) => (
            <span key={getPartKey(messagePart)}>
              {renderMessagePart(messagePart)}
            </span>
          ))}
        </p>
      </article>
    </li>
  )
}

export default MessageItem
