"use client"

import { useCallback, useEffect, useState } from "react"
import { ConversationController, Message, MessageEvents } from "@ably-labs/chat"

import { useConversation } from "./useConversation"

export const useMessages = (conversationId: string): Message[] => {
  const conversation = useConversation(conversationId)

  const [messages, setMessages] = useState<Message[]>([])

  const subscribeFn = useCallback(({ message }: { message: Message }) => {
    console.log("message created", message)
    // TODO: This is a hack to prevent duplicate messages, can be removed with mock server
    setMessages((prev) => {
      if (prev.length && prev[prev.length - 1]?.id === message.id) {
        return prev
      }
      return [...prev, message]
    })
  }, [])

  const init = useCallback(
    async (controller: ConversationController) => {
      const msgs = await controller.messages.query({ limit: 100 })
      setMessages(msgs)
      controller.messages.subscribe(MessageEvents.created, subscribeFn)
    },
    [subscribeFn]
  )

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
  }, [conversation, messages.length, subscribeFn])

  return messages
}
