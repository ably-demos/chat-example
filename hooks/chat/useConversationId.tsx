import { useContext } from "react"
import { ChatContext } from "@/providers/ChatProvider"

export const useConversationId = () => {
  const { conversationId } = useContext(ChatContext) ?? {}
  if (!conversationId) throw new Error("No conversationId is set")
  return conversationId
}
