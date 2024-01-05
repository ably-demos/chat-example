"use client"

import { useConversation } from "@/hooks/useConversation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ChatHeader from "./ConversationHeader"

type ConversationProps = {
  conversationId: string
}

const Conversation = ({ conversationId }: ConversationProps) => {
  const conversation = useConversation(conversationId)

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
