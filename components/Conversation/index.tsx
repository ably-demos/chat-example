"use client"

import { usePresence } from "ably/react"

import { useChat } from "@/hooks/useChat"
import { useClient } from "@/hooks/useClient"
// import { useChannel } from "hooks/useChannel"

import { useConversation } from "@/hooks/useConversation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ChatHeader from "./ConversationHeader"

type ConversationProps = {
  conversationId: string
}

const Conversation = ({ conversationId }: ConversationProps) => {
  const client = useChat()
  const conversation = useConversation(client, conversationId)

  const handlePresenceUpdate = (presenceData: any) => {
    console.log("presence update", presenceData)
    // if (presenceData.action === "present") {
    // setUsers((prev) => [...prev, presenceData.clientId])
    // }
  }

  const { presenceData } = usePresence(
    conversationId,
    "initialPresenceStatus",
    handlePresenceUpdate
  )

  console.log("presenceData", presenceData)

  const handleSend = async (text: string) => {
    if (!conversation) {
      console.error("Skipping send. Check Channel is set.")
      return
    }

    await conversation?.messages.send(text)
  }

  return (
    <Card className="flex h-full w-full flex-col rounded-none border-t-0">
      <CardHeader className="flex flex-row items-center">
        <ChatHeader title="Chat room" onlineUserCount={928} />
      </CardHeader>
      <CardContent className="flex grow">
        <MessageList conversationId={conversationId} />
      </CardContent>
      <CardFooter>
        <MessageInput onSubmit={handleSend} />
      </CardFooter>
    </Card>
  )
}

export default Conversation
