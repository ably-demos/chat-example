"use client"

import { useContext, useEffect, useState } from "react"
import { MessageContext } from "@/providers/MessageProvider"
import {
  ConversationController as Conversation,
  MessageEvents,
  MessageListener,
} from "@ably-labs/chat"

import { useChatContext } from "./useChatContext"
import { useConversation } from "./useConversation"

/**
 *
 * @param conversation Conversation object from Ably Chat SDK
 * @param eventName  Name of the Message event to subscribe to
 * @param cb The callback function to run when the event is fired
 *
 * @example
 * useMessageEvent(conversation, MessageEvents.created, ({ message }) =>
 *   setMessages((prevMessages) => [...prevMessages, message])
 * )
 */
export const useMessageEvent = (
  conversation: Conversation,
  eventName: MessageEvents,
  cb: MessageListener
) => {
  conversation.messages.subscribe(eventName, cb)
  useEffect(() => {
    return () => {
      conversation.messages.unsubscribe(eventName, cb)
    }
  }, [conversation.messages, cb, eventName])
}

/**
 * @param username This will be the client_id - user id - on the message. It should likely be the unique username/id for the user in your system
 *
 * @returns The messages for the current conversation, and methods to send, edit, delete, add and remove reactions
 *
 * @example
 * const {
 *  messages,
 *  loading,
 *  sendMessage,
 *  editMessage,
 *  deleteMessage,
 * } = useMessaVges(username)
 */
export const useMessages = (conversation: Conversation) => {
  const [isLoading, setIsLoading] = useState(false)

  const { messages, setMessages } = useContext(MessageContext)

  /**
   * @description This hook will add bot messages to the message list, and handle the bot reactions
   * It will only run if the environment variable WITH_BOTS is set to true
   */
  // useBots()

  /**
   * Load initial data
   */
  useEffect(() => {
    let mounted = true

    setIsLoading(true)

    const initMessages = async () => {
      const lastMessages = await conversation.messages.query({ limit: 10 })
      if (mounted) {
        setIsLoading(false)
        setMessages((prevMessages) => [...lastMessages, ...prevMessages])
      }
    }

    setMessages([])
    initMessages()

    return () => {
      mounted = false
    }
  }, [conversation.messages, setMessages])

  /**
   * Subscribe to message events
   */
  useMessageEvent(conversation, MessageEvents.created, ({ message }) =>
    setMessages((prevMessage) => [...prevMessage, message])
  )

  useMessageEvent(conversation, MessageEvents.deleted, ({ message }) =>
    setMessages((prevMessage) =>
      prevMessage.filter(({ id }) => id !== message.id)
    )
  )

  useMessageEvent(conversation, MessageEvents.updated, ({ message: updated }) =>
    setMessages((prevMessage) =>
      prevMessage.map((message) =>
        message.id !== updated.id
          ? message
          : { ...updated, reactions: message.reactions }
      )
    )
  )

  const {
    send: sendMessage,
    edit: editMessage,
    delete: deleteMessage,
  } = conversation.messages

  return {
    isLoading,
    messages,
    setMessages,
    sendMessage,
    editMessage,
    deleteMessage,
  }
}
