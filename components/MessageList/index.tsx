"use client"

import React, { useEffect, useRef } from "react"
import { useMembers } from "hooks/useMembers"
import { useMessages } from "hooks/useMessages"

import { Channel } from "@/types/temp"

import MessageItem from "../MessageItem"

type MessageListProps = {
  channel: Channel
}

const MessageList = ({ channel }: MessageListProps) => {
  const [messages] = useMessages(channel)
  const [members] = useMembers(channel)
  const messageListRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (!messageListRef.current) return
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight
  }, [messages])

  return (
    <ol ref={messageListRef} className="space-y-4 grow w-full flex flex-col">
      {messages.map((message) => {
        const user = members.find((member) => member.id === message.user_id)!
        return (
          <MessageItem
            key={message.created_at}
            message={message}
            username={user.username}
            avatar={user.imageUrl}
          />
        )
      })}
    </ol>
  )
}

export default MessageList
