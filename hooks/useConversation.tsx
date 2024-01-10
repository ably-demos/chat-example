"use client"

import { useCallback, useEffect, useMemo } from "react"
import { ConversationController as Conversation } from "@ably-labs/chat"

import { useConversations } from "./useConversations"

export const useConversation = (conversationId: string): Conversation => {
  const conversations = useConversations()

  const conversation = useMemo<Conversation>(
    () => conversations.get(conversationId),
    [conversations, conversationId]
  )

  const create = useCallback(async () => {
    conversation?.create()
  }, [conversation])

  useEffect(() => {
    if (!conversations || !conversation) return
    create()
  }, [conversations, conversation, create])

  return conversation
}
