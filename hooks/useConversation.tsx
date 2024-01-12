"use client"

import { useMemo } from "react"
import { ConversationController as Conversation } from "@ably-labs/chat"

import { useConversations } from "./useConversations"

export const useConversation = (conversationId: string): Conversation => {
  const conversations = useConversations()

  return useMemo<Conversation>(
    () => conversations.get(conversationId),
    [conversations, conversationId]
  )
}
