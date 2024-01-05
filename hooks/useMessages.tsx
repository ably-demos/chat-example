"use client"

import { useCallback, useEffect, useState } from "react"

import {
  ConversationController,
  Message,
  MessageEvents,
} from "@/components/ably"

import { useChat } from "./useChat"
import { useConversation } from "./useConversation"

export const useMessages = (conversationId: string): Message[] => {
  const client = useChat()

  const conversation = useConversation(client, conversationId)

  const [messages, setMessages] = useState<Message[]>([])

  const subscribeFn = ({ message }: { message: Message }) => {
    setMessages((prev) => [...prev, message])
  }

  const init = useCallback(async (controller: ConversationController) => {
    const msgs = await controller.messages.query({ limit: 100 })
    setMessages(msgs)
    controller.messages.subscribe(MessageEvents.created, subscribeFn)
  }, [])

  useEffect(() => {
    if (!conversation) return
    init(conversation)
  }, [conversation, init])

  useEffect(() => {
    if (!conversation) {
      if (messages.length > 0) setMessages([])
      return
    }

    return () => {
      conversation.messages.unsubscribe(MessageEvents.created, subscribeFn)
    }
  }, [conversation, messages.length])

  return messages
}
