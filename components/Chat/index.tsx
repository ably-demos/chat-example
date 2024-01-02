"use client"

import { useState } from "react"
import { useChannel, usePresence } from "ably/react"

// import { useChannel } from "hooks/useChannel"

import { Message } from "@/types/temp"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import ChatHeader from "../ChatHeader"
import LoadingDots from "../LoadingDots"
import MessageInput from "../MessageInput"
import MessageList from "../MessageList"

type ChatComponentProps = {
  username: string
  channelRef: string
}

const Chat = ({ username, channelRef }: ChatComponentProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<string[]>([])

  const handlePresenceUpdate = (presenceData: any) => {
    console.log("presence update", presenceData)
    if (presenceData.action === "present") {
      setUsers((prev) => [...prev, presenceData.clientId])
    }
  }

  const { presenceData } = usePresence(
    channelRef,
    "initialPresenceStatus",
    handlePresenceUpdate
  )

  console.log("presenceData", presenceData)

  const { channel } = useChannel(channelRef, (message) => {
    setMessages((prev) => [...prev, message as unknown as Message])
  })

  const handleSend = async (text: string) => {
    if (!channel) {
      console.error("Skipping send. Check Channel is set.")
      return
    }

    const msgData = {
      name: "new_message",
      data: text,
    }

    await channel.publish(msgData)
    console.trace("message sent")
  }

  if (!channel) return <LoadingDots />

  return (
    <Card className="flex h-full w-full flex-col rounded-none border-t-0">
      <CardHeader className="flex flex-row items-center">
        <ChatHeader channelName="Chat room" onlineUserCount={928} />
      </CardHeader>
      <CardContent className="flex grow">
        <MessageList messages={messages} />
      </CardContent>
      <CardFooter>
        <MessageInput onSubmit={handleSend} />
      </CardFooter>
    </Card>
  )
}

export default Chat
