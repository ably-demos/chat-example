import { useContext } from "react"
import { ChatContext } from "@/providers/ChatProvider"

/**
 * @returns The current chat for the closest ChatProvider
 * @example
 * const {} = useChatContext()
 */
export const useChat = () => {
  const { client, conversationId, conversation } = useContext(ChatContext) ?? {}

  if (!client) throw new Error("Chat is not setup")
  if (!conversation) throw new Error("Conversation is not set")
  if (!conversationId) throw new Error("No conversationId is set")

  return {
    client,
    conversationId,
    conversation,
  }
}
