import { useMemo } from "react"
import { Chat, ConversationController as Conversation } from "@ably-labs/chat"
import { useAbly } from "ably/react"

/**
 * @returns The current chat for the closest ChatProvider
 * @example
 * const conversation = useConversation("my-conversation-name")
 */
export const useConversation = (conversationId: string) => {
  const client = useAbly()

  const chat = useMemo(() => new Chat(client), [client])

  if (!conversationId) throw new Error("No conversationId is set")

  return useMemo<Conversation>(
    () => chat.conversations.get(conversationId),
    [chat, conversationId]
  )
}
