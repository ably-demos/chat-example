"use client"

import { useCallback, useContext, useEffect, useMemo } from "react"
import { ChatContext } from "@/providers/ChatProvider"
import { Maybe } from "@/types"

import { ConversationController } from "@/components/ably"

export const useConversation = (
  conversationId: string
): Maybe<ConversationController> => {
  const { client } = useContext(ChatContext) ?? {}
  const conversation = useMemo<Maybe<ConversationController>>(
    () => client?.conversations.get(conversationId),
    [client?.conversations, conversationId]
  )

  const create = useCallback(async () => {
    await conversation?.create()
  }, [conversation])

  useEffect(() => {
    if (!client || !conversation) return
    create()
  }, [client, conversation, create])

  return conversation
}
