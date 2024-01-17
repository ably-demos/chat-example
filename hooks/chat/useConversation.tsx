"use client"

import { useMemo } from "react"
import { ConversationController as Conversation } from "@ably-labs/chat"

import { useChat } from "./useChat"
import { useConversationId } from "./useConversationId"

export const useConversation = (): Conversation => {
  const conversationId = useConversationId()
  const { conversations } = useChat()

  return useMemo<Conversation>(
    () => conversations.get(conversationId),
    [conversations, conversationId]
  )
}
