"use client"

import React, { useRef } from "react"
import { Message } from "@ably-labs/chat"

// import { useReactions } from "@/hooks/chat/useReactions"

import MessageItem from "../MessageItem"
import Spinner from "../Spinner"

type MessageListProps = {
  username: string
  loading: boolean
  messages: Message[]
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
  onAddReaction: (messageId: string, reaction: string) => void
  onRemoveReaction: (messageId: string, reactionId: string) => void
}

const MessageList = ({
  username,
  loading,
  messages,
  onEdit,
  onDelete,
  onAddReaction,
  onRemoveReaction,
}: MessageListProps) => {
  const messageListRef = useRef<HTMLOListElement>(null)

  if (loading) return <Spinner />

  // TODO: Virtualize
  return (
    <ol ref={messageListRef}>
      {messages.map((message) => {
        return (
          <MessageItem
            username={username}
            key={message.id}
            message={message}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
          />
        )
      })}
    </ol>
  )
}

export default MessageList
