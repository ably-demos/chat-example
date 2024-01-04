import React from "react"
import { ChatProvider } from "@/providers/ChatProvider"

import { useChat } from "@/hooks/useChat"

import Conversation from "../Conversation"

type ChatClientProps = {
  conversationId: string
}

const ChatClient = ({ conversationId }: ChatClientProps) => {
  const client = useChat()

  if (!client) return null

  return (
    <ChatProvider client={client} conversationId={conversationId}>
      <Conversation conversationId={conversationId} />
    </ChatProvider>
  )
}

export default ChatClient
