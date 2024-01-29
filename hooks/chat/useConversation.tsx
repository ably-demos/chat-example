import { useMemo } from "react"
import { ConversationController as Conversation } from "@ably-labs/chat"

import { useChat } from "./useChat"

/**
 * @returns The current chat for the closest ChatProvider
 * @example
 * const conversation = useConversation("my-conversation-name")
 */
export const useConversation = (givenConversationId?: string) => {
  const { client, conversationId } = useChat()

  if (!conversationId) throw new Error("No conversationId is set")

  return useMemo<Conversation>(() => {
    const c = client.conversations.get(givenConversationId ?? conversationId)
    c.create()
    return c
  }, [client.conversations, conversationId, givenConversationId])
}
