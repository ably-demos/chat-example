"use client"

// import { useCallback, useEffect, useState } from "react"
// import { ConversationController, Message, MessageEvents } from "@ably-labs/chat"

// import { useConversation } from "./useConversation"

// export const useMessages = (): Message[] => {
//   const conversation = useConversation()

//   const [messages, setMessages] = useState<Message[]>([])

//   const subscribeFn = useCallback(({ message }: { message: Message }) => {
//     console.debug("message created", message)
//     // TODO: This is a hack to prevent duplicate messages, can be removed with mock server
//     setMessages((prev) => {
//       if (prev.length && prev[prev.length - 1]?.id === message.id) {
//         return prev
//       }
//       return [...prev, message]
//     })
//   }, [])

//   const init = useCallback(
//     async (controller: ConversationController) => {
//       const msgs = await controller.messages.query({ limit: 100 })
//       setMessages(msgs)
//       controller.messages.subscribe(MessageEvents.created, subscribeFn)
//     },
//     [subscribeFn]
//   )

//   useEffect(() => {
//     if (!conversation) return
//     init(conversation)
//   }, [conversation, init])

//   useEffect(() => {
//     if (!conversation) {
//       if (messages.length > 0) setMessages([])
//       return
//     }

//     return () => {
//       conversation.messages.unsubscribe(MessageEvents.created, subscribeFn)
//     }
//   }, [conversation, messages.length, subscribeFn])

//   return messages
// }
import { useCallback, useEffect, useState } from "react"
import {
  Message,
  MessageEvents,
  ReactionEvents,
  type MessageListener,
  type ReactionListener,
} from "@ably-labs/chat"

import { useConversation } from "./useConversation"

export const useMessages = (username: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const conversation = useConversation()

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
    conversation.messages.subscribeReactions(
      ReactionEvents.added,
      handleReactionAdd
    )
    conversation.messages.subscribeReactions(
      ReactionEvents.deleted,
      handleReactionDelete
    )

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
