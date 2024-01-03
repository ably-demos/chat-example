"use client"

import { useState } from "react"
import { useChannel, usePresence } from "ably/react"

// import { useChannel } from "hooks/useChannel"

import { Message } from "@/types/temp"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import Spinner from "../Spinner"
import ChatHeader from "./ChatHeader"

type ChatComponentProps = {
  channelId: string
}

const Chat = ({ channelId }: ChatComponentProps) => {
  const [messages, setMessages] = useState<Message[]>([])

  const handlePresenceUpdate = (presenceData: any) => {
    console.log("presence update", presenceData)
    // if (presenceData.action === "present") {
    // setUsers((prev) => [...prev, presenceData.clientId])
    // }
  }

  const { presenceData } = usePresence(
    channelId,
    "initialPresenceStatus",
    handlePresenceUpdate
  )

  console.log("presenceData", presenceData)

  const { channel, connectionError, channelError } = useChannel(
    channelId,
    (message) => {
      setMessages((prev) => [...prev, message as unknown as Message])
    }
  )

  const handleSend = async (text: string) => {
    if (!channel) {
      console.error("Skipping send. Check Channel is set.")
      return
    }

    await channel.publish({
      name: "new_message",
      data: text,
    })
  }

  if (!channel) return <Spinner />

  if (channelError) {
    console.error("Channel error", channelError)
    return <div>Channel error</div>
  }
  if (connectionError) {
    console.error("Connection error", connectionError)
    return <div>Connection error</div>
  }

  return (
    <Card className="flex h-full w-full flex-col rounded-none border-t-0">
      <CardHeader className="flex flex-row items-center">
        <ChatHeader title="Chat room" onlineUserCount={928} />
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
