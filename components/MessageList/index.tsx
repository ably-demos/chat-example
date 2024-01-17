"use client"

import React, { useRef } from "react"
import { Message } from "@ably-labs/chat"

import { useMessages } from "@/hooks/chat/useMessages"

import MessageItem from "../MessageItem"
import Spinner from "../Spinner"

type MessageListProps = {
  messages?: Message[]
  username: string
  onEdit: (messageId: string) => void
}

const MessageList = ({ username, onEdit: handleEdit }: MessageListProps) => {
  const messageListRef = useRef<HTMLOListElement>(null)
  const { messages, addReaction, deleteMessage, removeReaction } =
    useMessages(username)

  if (!messages) return <Spinner />

  return (
    <ol
      ref={messageListRef}
      className="flex w-full grow flex-col items-start space-y-2"
    >
      {messages.map((message) => {
        return (
          <MessageItem
            key={message.id}
            username={username}
            message={message}
            onAddReaction={addReaction}
            onEditClick={handleEdit}
            onDeleteClick={deleteMessage}
            onRemoveReaction={removeReaction}
          />
        )
      })}
    </ol>
  )
}

export default MessageList
