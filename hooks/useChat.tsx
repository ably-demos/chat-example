import { useContext, useMemo } from "react"
import { ConversationController as Conversation } from "@ably-labs/chat"

import { ChatContext } from "@/components/ChatProvider"

export const useChat = () => {
  const { chat, conversationId } = useContext(ChatContext) ?? {}

  if (!chat) throw new Error("Chat is not setup")
  if (!conversationId) throw new Error("No conversationId is set")

  return useMemo<Conversation>(
    () => chat.conversations.get(conversationId),
    [chat, conversationId]
  )
}
