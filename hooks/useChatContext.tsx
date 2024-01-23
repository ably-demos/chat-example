import { useContext, useMemo } from "react"

import { ChatContext } from "@/components/ChatProvider"

/**
 * @returns The current chat for the closest ChatProvider
 * @example
 * const {} = useChatContext()
 */
export const useChatContext = () => {
  const { chat, conversationId } = useContext(ChatContext) ?? {}

  if (!chat) throw new Error("Chat is not setup")
  if (!conversationId) throw new Error("No conversationId is set")

  return useMemo(() => ({
    chat,
    conversationId,
  }), [chat, conversationId]) 
}
