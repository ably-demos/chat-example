"use client"

import React, { useRef } from "react"
import { Message } from "@ably-labs/chat"

import MessageItem from "../MessageItem"
import Spinner from "../Spinner"

type MessageListProps = {
  messages?: Message[]
  onAddReaction: (messageId: string) => void
  onDelete: (messageId: string) => void
  onEdit: (messageId: string) => void
}

const MessageList = ({
  messages,
  onAddReaction: handleAddReaction,
  onDelete: handleDelete,
  onEdit: handleEdit,
}: MessageListProps) => {
  const messageListRef = useRef<HTMLOListElement>(null)

  if (!messages) return <Spinner />

  return (
    <ol
      ref={messageListRef}
      className="flex w-full grow flex-col items-start space-y-2"
    >
      {messages.map((message) => {
        return (
          <MessageItem
            key={`${message.created_at}_${message.client_id}`}
            message={message}
            username={message.client_id}
            onEdit={() => handleEdit(message.id)}
            onAddReaction={() => handleAddReaction(message.id)}
            onDelete={() => handleDelete(message.id)}
          />
        )
      })}
    </ol>
  )
}

export default MessageList
