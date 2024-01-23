"use client"

import React, { useRef } from "react"
import { ScrollArea } from "@radix-ui/react-scroll-area"

import { useMessages } from "@/hooks/useMessages"

import MessageItem from "../MessageItem"
import Spinner from "../Spinner"
import { ScrollBar } from "../ui/scroll-area"

type MessageListProps = {
  username: string
  onEdit: (messageId: string, content: string) => void
}

const MessageList = ({ username, onEdit: handleEdit }: MessageListProps) => {
  const messageListRef = useRef<HTMLOListElement>(null)

  const { messages, addReaction, deleteMessage, removeReaction } =
    useMessages(username)

  if (!messages) return <Spinner />

  // TODO: Virtualize
  return (
    <ol ref={messageListRef}>
      {messages.map((message) => {
        return (
          <MessageItem
            key={message.id}
            username={username}
            message={message}
            onEditClick={handleEdit}
            onDeleteClick={deleteMessage}
            onAddReaction={addReaction}
            onRemoveReaction={removeReaction}
          />
        )
      })}
    </ol>
  )
}

export default MessageList
