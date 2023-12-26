"use client"

import React, { useEffect, useRef } from "react"
import { type Types as Ably } from "ably/promises"

import { Message } from "@/types/temp"

// import { useMembers } from "hooks/useMembers"

import MessageItem from "../MessageItem"

type MessageListProps = {
  messages: Message[]
}

const MessageList = ({ messages }: MessageListProps) => {
  const messageListRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (!messageListRef.current) return
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight
  }, [messages])

  return (
    <ol ref={messageListRef} className="flex w-full grow flex-col space-y-4">
      {messages.map((message) => {
        return (
          <MessageItem
            key={message.timestamp}
            message={message}
            username={message.clientId}
            color="hsl(var(--muted-foreground)"
          />
        )
      })}
    </ol>
  )
}

export default MessageList
