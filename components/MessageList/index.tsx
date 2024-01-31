"use client"

import React from "react"
import { Message } from "@ably-labs/chat"

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
  if (loading) return <Spinner />

  return (
    <ol>
      {messages.map((message) => {
        return (
          <MessageItem
            key={message.id}
            username={username}
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
