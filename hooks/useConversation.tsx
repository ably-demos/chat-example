"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Maybe } from "@/types"

import { Chat, ConversationController } from "@/components/ably"

import { useClient } from "./useClient"

// import { Channel } from "@/types/temp"

export const useConversation = (
  client: Maybe<Chat>,
  conversationId: string
): Maybe<ConversationController> => {
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
