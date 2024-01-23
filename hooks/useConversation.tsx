import { useContext, useMemo } from "react"
import { ConversationController as Conversation } from "@ably-labs/chat"

import { ChatContext } from "@/components/ChatProvider"

/**
 * @returns The current chat for the closest ChatProvider
 * @example
 * const conversation = useConversation("my-conversation-name")
 */
export const useConversation = (conversationId: string) => {
  const { chat } = useContext(ChatContext) ?? {}

  if (!chat) throw new Error("Chat is not setup")
  if (!conversationId) throw new Error("No conversationId is set")

  return useMemo<Conversation>(
    () => chat.conversations.get(conversationId),
    [chat, conversationId]
  )
}
