"use client"

import { useMemo } from "react"
import { ConversationController as Conversation } from "@ably-labs/chat"

import { useChat } from "./useChat"

export const useConversation = (conversationId: string): Conversation => {
  const { conversations } = useChat()

  return useMemo<Conversation>(
    () => conversations.get(conversationId),
    [conversations, conversationId]
  )
}
