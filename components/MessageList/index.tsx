"use client"

import React, { useEffect, useRef } from "react"

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
    <ol
      ref={messageListRef}
      className="flex w-full grow flex-col items-start space-y-2"
    >
      {messages.map((message) => {
        return (
          <MessageItem
            key={message.timestamp}
            message={message}
            username={message.clientId}
          />
        )
      })}
    </ol>
  )
}

export default MessageList
