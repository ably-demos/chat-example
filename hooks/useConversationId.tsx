import { useContext } from "react"

import { ChatContext } from "@/components/ChatProvider"

export const useConversationId = () => {
  const { conversationId } = useContext(ChatContext) ?? {}
  if (!conversationId) {
    throw new Error("useConversationId must be used within a ChatProvider")
  }
  return conversationId
}
