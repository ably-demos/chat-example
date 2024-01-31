import { use, useCallback, useEffect, useRef, useState } from "react"
import {
  ConversationController as Conversation,
  Message,
  MessageEvents,
  ReactionEvents,
  type MessageListener,
  type ReactionListener,
} from "@ably-labs/chat"
import { uniq } from "underscore"

import { mapFromDelete, mapFromUpdate } from "@/lib/reaction"

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
 *
 * @description Listen to Reaction events on the given conversation, and run the callback function when the event is triggered
 * @param conversation Conversation object from Ably Chat SDK
 * @param eventName  Name of the Reaction event to subscribe to
 * @param cb The callback function to run when the event is fired
 *
 * @example
 * useReactionEvent(conversation, ReactionEvents.created, ({ reaction }) => {
 *   console.log(reaction)
 * })
 */
export const useReactionEvent = (
  conversation: Conversation,
  eventName: ReactionEvents,
  cb: ReactionListener
) => {
  conversation.messages.subscribeReactions(eventName, cb)
  useEffect(() => {
    return () => {
      conversation.messages.unsubscribeReactions(eventName, cb)
    }
  }, [conversation.messages, cb, eventName])
}

/**
 * @description This hook will return the messages for the current conversation, subscribe to new ones
 * @param username This will be the client_id - user id - on the message. It should likely be the unique username/id for the user in your system
 * @returns The messages for the current conversation, loading status and methods to send, edit, delete, add and remove reactions
 *
 * @example
 * const {
 *   messages,
 *   loading,
 *   sendMessage,
 *   editMessage,
 *   deleteMessage,
 * } = useMessagesWrapped(conversationId, username)
 */
export const useMessages = (channelName: string, username?: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const pageCursor = useRef<string | null>(null)
  const conversation = useConversation(channelName)

  useEffect(() => {
    setMessages([])
  }, [channelName])

  useEffect(() => {
    let mounted = true
    const initMessages = async () => {
      const nextMessages = await conversation.messages.query({
        limit: 200,
        direction: "forwards",
        ...(pageCursor.current && { startId: pageCursor.current }),
      })
      if (mounted) {
        setIsLoading(false)
        pageCursor.current = nextMessages.at(-1)?.id ?? null
        setMessages((prevMessages) =>
          uniq([...nextMessages, ...prevMessages], ({ id }) => id)
        )
      }
    }

    pageCursor.current = null
    setIsLoading(true)
    initMessages()

    return () => {
      mounted = false
    }
  }, [conversation, username])

  const handleAdd: MessageListener = useCallback(({ message }) => {
    setMessages((prevMessage) =>
      uniq([...prevMessage, message], ({ id }) => id)
    )
  }, [])

  const handleUpdate: MessageListener = useCallback(({ message: updated }) => {
    setMessages((prevMessage) =>
      prevMessage.map((message) =>
        message.id !== updated.id ? message : updated
      )
    )
  }, [])

  const handleDelete: MessageListener = useCallback(({ message }) => {
    setMessages((prevMessage) =>
      prevMessage.filter(({ id }) => id !== message.id)
    )
  }, [])

  const handleReactionAdd: ReactionListener = useCallback(
    ({ reaction }) => {
      setMessages((prevMessage) =>
        prevMessage.map((message) => mapFromUpdate(message, reaction, username))
      )
    },
    [username]
  )

  const handleReactionDelete: ReactionListener = useCallback(
    ({ reaction }) => {
      setMessages((prevMessage) =>
        prevMessage.map((message) => mapFromDelete(message, reaction, username))
      )
    },
    [username]
  )

  useMessageEvent(conversation, MessageEvents.created, handleAdd)
  useMessageEvent(conversation, MessageEvents.edited, handleUpdate)
  useMessageEvent(conversation, MessageEvents.deleted, handleDelete)
  useReactionEvent(conversation, ReactionEvents.created, handleReactionAdd)
  useReactionEvent(conversation, ReactionEvents.deleted, handleReactionDelete)

  const sendMessage = useCallback(
    (text: string) => {
      conversation.messages.send(text)
    },
    [conversation]
  )

  const editMessage = useCallback(
    (messageId: string, text: string) => {
      conversation.messages.edit(messageId, text)
    },
    [conversation]
  )

  const deleteMessage = useCallback(
    (messageId: string) => {
      conversation.messages.delete(messageId)
    },
    [conversation]
  )

  const addReaction = useCallback(
    (messageId: string, type: string) => {
      conversation.messages.addReaction(messageId, type)
    },
    [conversation.messages]
  )

  const removeReaction = useCallback(
    (reactionId: string) => {
      conversation.messages.removeReaction(reactionId)
    },
    [conversation]
  )

  return {
    isLoading,
    messages,
    editMessage,
    sendMessage,
    deleteMessage,
    addReaction,
    removeReaction,
  }
}
