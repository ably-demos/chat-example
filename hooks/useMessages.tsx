"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Message,
  MessageEvents,
  ReactionEvents,
  type MessageListener,
  type ReactionListener,
} from "@ably-labs/chat"

import { useChatContext } from "./useChatContext"
import { useConversation } from "./useConversation"

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
 *  addReaction,
 *  removeReaction,
 * } = useMessages(username)
 */
export const useMessages = (username: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const { conversationId } = useChatContext()
  const conversation = useConversation(conversationId)

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

  useEffect(() => {
    setLoading(true)
    const handleAdd: MessageListener = ({ message }) => {
      setMessages((prevMessage) => [...prevMessage, message])
    }
    const handleUpdate: MessageListener = ({ message: updated }) => {
      setMessages((prevMessage) =>
        prevMessage.map((message) =>
          message.id !== updated.id
            ? message
            : { ...updated, reactions: message.reactions }
        )
      )
    }
    const handleDelete: MessageListener = ({ message }) => {
      setMessages((prevMessage) =>
        prevMessage.filter(({ id }) => id !== message.id)
      )
    }
    const handleReactionAdd: ReactionListener = ({ reaction }) => {
      setMessages((prevMessage) =>
        prevMessage.map((message) =>
          message.id !== reaction.message_id
            ? message
            : {
                ...message,
                reactions: {
                  mine:
                    reaction.client_id === username
                      ? [...message.reactions.mine, reaction]
                      : message.reactions.mine,
                  latest: [...message.reactions.latest, reaction],
                  counts: {
                    ...message.reactions.counts,
                    [reaction.type]:
                      (message.reactions.counts[reaction.type] ?? 0) + 1,
                  },
                },
              }
        )
      )
    }
    const handleReactionDelete: ReactionListener = ({ reaction }) => {
      setMessages((prevMessage) =>
        prevMessage.map((message) =>
          message.id !== reaction.message_id
            ? message
            : {
                ...message,
                reactions: {
                  mine:
                    reaction.client_id === username
                      ? message.reactions.mine.filter(
                          ({ id }) => id !== reaction.id
                        )
                      : message.reactions.mine,
                  latest: message.reactions.latest.filter(
                    ({ id }) => id !== reaction.id
                  ),
                  counts: {
                    ...message.reactions.counts,
                    [reaction.type]:
                      message.reactions.counts[reaction.type] - 1,
                  },
                },
              }
        )
      )
    }

    conversation.messages.subscribe(MessageEvents.created, handleAdd)
    conversation.messages.subscribe(MessageEvents.updated, handleUpdate)
    conversation.messages.subscribe(MessageEvents.deleted, handleDelete)

    let mounted = true
    const initMessages = async () => {
      const lastMessages = await conversation.messages.query({ limit: 10 })
      if (mounted) {
        setLoading(false)
        setMessages((prevMessages) => [...lastMessages, ...prevMessages])
      }
    }
    setMessages([])
    initMessages()

    return () => {
      mounted = false
      conversation.messages.unsubscribe(MessageEvents.created, handleAdd)
      conversation.messages.unsubscribe(MessageEvents.updated, handleUpdate)
      conversation.messages.unsubscribe(MessageEvents.deleted, handleDelete)
      conversation.messages.unsubscribeReactions(
        ReactionEvents.added,
        handleReactionAdd
      )
      conversation.messages.unsubscribeReactions(
        ReactionEvents.deleted,
        handleReactionDelete
      )
    }
  }, [conversation, username])

  return useMemo(() => ({ 
    loading,
    messages,
    editMessage,
    sendMessage,
    deleteMessage,
    addReaction,
    removeReaction,
  }), [addReaction, deleteMessage, editMessage, loading, messages, removeReaction, sendMessage])
}
