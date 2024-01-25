"use client"

import React, { useRef } from "react"
import {
  ConversationController as Conversation,
  Message,
} from "@ably-labs/chat"

import { useReactions } from "@/hooks/chat/useReactions"

import MessageItem from "../MessageItem"
import Spinner from "../Spinner"

type MessageListProps = {
  conversation: Conversation
  username: string
  loading: boolean
  messages: Message[]
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
}

const MessageList = ({
  conversation,
  username,
  loading,
  messages,
  onEdit,
  onDelete,
}: MessageListProps) => {
  const messageListRef = useRef<HTMLOListElement>(null)
  const { addReaction, removeReaction } = useReactions(conversation, username)

  if (loading) return <Spinner />

  // TODO: Virtualize
  return (
    <ol ref={messageListRef}>
      {messages.map((message) => {
        return (
          <MessageItem
            key={message.id}
            username={username}
            message={message}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddReaction={addReaction}
            onRemoveReaction={removeReaction}
          />
        )
      })}
    </ol>
  )
}

export default MessageList
