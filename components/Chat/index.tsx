"use client"

import { useCallback, useEffect, useRef } from "react"
import { useChatClient } from "@ably/chat/react"

import { useMessages } from "@/hooks/chat/useMessages"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ChatHeader from "./ChatHeader"

type ChatProps = {}

const Chat = (_props: ChatProps) => {
  const messageListRef = useRef<HTMLDivElement>(null)
  const { clientId } = useChatClient()
  const { messages, isLoading, sendMessage } = useMessages(clientId)

  const handleSend = useCallback(
    (content: string) => {
      return sendMessage(content)
    },
    [sendMessage]
  )

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="flex flex-col rounded-none border-t-0 md:size-full">
      <CardHeader className="flex flex-row items-center">
        <ChatHeader />
      </CardHeader>
      <CardContent className="h-0 min-h-0 flex-auto space-y-2 overflow-y-auto">
        <MessageList
          ref={messageListRef}
          messages={messages}
          loading={isLoading}
          username={clientId}
        />
        <MessageInput onSubmit={handleSend} />
      </CardContent>
    </Card>
  )
}

export default Chat
