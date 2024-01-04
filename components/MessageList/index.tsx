"use client"

import React, { useRef } from "react"

import { useMessages } from "@/hooks/useMessages"

import MessageItem from "../MessageItem"
import Spinner from "../Spinner"

type MessageListProps = {
  conversationId: string
}

const MessageList = ({ conversationId }: MessageListProps) => {
  const messageListRef = useRef<HTMLOListElement>(null)
  const messages = useMessages(conversationId)

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
          />
        )
      })}
    </ol>
  )
}

export default MessageList
