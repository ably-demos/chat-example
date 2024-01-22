"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Message,
  MessageEvents,
  ReactionEvents,
  type MessageListener,
  type ReactionListener,
} from "@ably-labs/chat"

import { useChat } from "./useChat"

export const useMessages = (username: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const chat = useChat()

  const sendMessage = useCallback(
    (text: string) => {
      chat.messages.send(text)
    },
    [chat]
  )

  const editMessage = useCallback(
    (messageId: string, text: string) => {
      chat.messages.edit(messageId, text)
    },
    [chat]
  )

  const deleteMessage = useCallback(
    (messageId: string) => {
      chat.messages.delete(messageId)
    },
    [chat]
  )

  const addReaction = useCallback(
    (messageId: string, type: string) => {
      chat.messages.addReaction(messageId, type)
    },
    [chat]
  )

  const removeReaction = useCallback(
    (reactionId: string) => {
      chat.messages.removeReaction(reactionId)
    },
    [chat]
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

    chat.messages.subscribe(MessageEvents.created, handleAdd)
    chat.messages.subscribe(MessageEvents.updated, handleUpdate)
    chat.messages.subscribe(MessageEvents.deleted, handleDelete)

    let mounted = true
    const initMessages = async () => {
      const lastMessages = await chat.messages.query({ limit: 10 })
      if (mounted) {
        setLoading(false)
        setMessages((prevMessages) => [...lastMessages, ...prevMessages])
      }
    }
    setMessages([])
    initMessages()

    return () => {
      mounted = false
      chat.messages.unsubscribe(MessageEvents.created, handleAdd)
      chat.messages.unsubscribe(MessageEvents.updated, handleUpdate)
      chat.messages.unsubscribe(MessageEvents.deleted, handleDelete)
      chat.messages.unsubscribeReactions(
        ReactionEvents.added,
        handleReactionAdd
      )
      chat.messages.unsubscribeReactions(
        ReactionEvents.deleted,
        handleReactionDelete
      )
    }
  }, [chat, username])

  return {
    loading,
    messages,
    editMessage,
    sendMessage,
    deleteMessage,
    addReaction,
    removeReaction,
  }
}
