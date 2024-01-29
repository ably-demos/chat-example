import { use, useCallback, useEffect, useState } from "react"
import {
  ConversationController as Conversation,
  Message,
  MessageEvents,
  ReactionEvents,
  type MessageListener,
  type ReactionListener,
} from "@ably-labs/chat"
import { create, sortBy, uniq } from "underscore"

import { botConfig } from "@/config/bots"
import { mapFromDelete, mapFromUpdate } from "@/lib/reaction"

import { useBots } from "./useBots"
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
 * } = useMessage(username)
 *
 */
const useMessagesWrapped = (username: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [pageCursor, setPageCursor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // REVIEW
  const conversation = useConversation()

  useEffect(() => {
    setIsLoading(true)

    let mounted = true
    const initMessages = async () => {
      const lastMessages = await conversation.messages.query({
        // REVIEW It would be good to be able to query for messages from/to a given time
        limit: 10,
        // REVIEW, startId is not working as expected.
        ...(pageCursor && { startId: pageCursor }),
      })
      if (mounted) {
        setIsLoading(false)
        setMessages((prevMessages) =>
          sortBy(
            [...lastMessages, ...prevMessages],
            ({ created_at }) => created_at
          )
        )
      }
    }

    setMessages([])
    setPageCursor(null)
    initMessages()

    return () => {
      mounted = false
    }
  }, [conversation, pageCursor, username])

  const handleAdd: MessageListener = useCallback(({ message }) => {
    setMessages((prevMessage) =>
      uniq([...prevMessage, message], ({ id }) => id)
    )
  }, [])

  const handleUpdate: MessageListener = useCallback(({ message: updated }) => {
    setMessages((prevMessage) =>
      prevMessage.map((message) =>
        message.id !== updated.id
          ? message
          : { ...updated, reactions: message.reactions }
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
      console.log("NEW REACTION", reaction)
      setMessages((prevMessage) =>
        prevMessage.map((message) => mapFromUpdate(username, message, reaction))
      )
    },
    [username]
  )

  const handleReactionDelete: ReactionListener = useCallback(
    ({ reaction }) => {
      setMessages((prevMessage) =>
        prevMessage.map((message) => mapFromDelete(username, message, reaction))
      )
    },
    [username]
  )

  useMessageEvent(conversation, MessageEvents.created, handleAdd)
  useMessageEvent(conversation, MessageEvents.edited, handleUpdate)
  useMessageEvent(conversation, MessageEvents.deleted, handleDelete)
  useReactionEvent(conversation, ReactionEvents.added, handleReactionAdd)
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
    [conversation]
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
const WITH_BOTS = process.env.NEXT_PUBLIC_WITH_BOTS === "true"

export const useMessages = (username: string) => {
  const {
    isLoading,
    messages,
    editMessage,
    sendMessage,
    deleteMessage,
    addReaction: addReactionWrapped,
    removeReaction: removeReactionWrapped,
  } = useMessagesWrapped(username)

  const botConversation = useConversation(botConfig.channelName)

  const addReaction = useCallback(
    (messageId: string, type: string) => {
      const message = messages.find(({ id }) => id === messageId)
      if (
        WITH_BOTS &&
        message?.created_by.startsWith(botConfig.usernamePrefix)
      ) {
        botConversation.messages.addReaction(messageId, type)
      } else {
        addReactionWrapped(messageId, type)
      }
    },
    [addReactionWrapped, botConversation.messages, messages]
  )

  const removeReaction = useCallback(
    (messageId: string, reactionId: string) => {
      const message = messages.find(({ id }) => id === messageId)
      if (WITH_BOTS && message?.conversation_id === botConfig.channelName) {
        botConversation.messages.removeReaction(reactionId)
      } else {
        removeReactionWrapped(reactionId)
      }
    },
    [botConversation.messages, messages, removeReactionWrapped]
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
