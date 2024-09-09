"use client"

import { useEffect, useRef, useState } from "react"
import { Message } from "@ably/chat"
import { useMessages } from "@ably/chat/react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ChatHeader from "./ChatHeader"

type ChatProps = {}

const Chat = (_props: ChatProps) => {
  const messageListRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { send, getPreviousMessages } = useMessages({
    listener: (message) => {
      setMessages((prevMessage) => [...prevMessage, message.message])
    },
    onDiscontinuity: (discontinuity) => {
      console.error("Discontinuity detected", discontinuity)
      // reset the messages when a discontinuity is detected,
      setMessages([])
      // triggers the useEffect to fetch the initial messages again.
      setIsLoading(true)
    },
  })

  useEffect(() => {
    if (getPreviousMessages && isLoading) {
      getPreviousMessages({ limit: 50 })
        .then((result) => {
          setMessages((prevMessages) => [
            ...result.items.reverse(),
            ...prevMessages,
          ])
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching previous messages", error)
        })
    }
  }, [getPreviousMessages, isLoading])

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
        />
      </CardContent>
      <MessageInput onSubmit={send} />
    </Card>
  )
}

export default Chat
