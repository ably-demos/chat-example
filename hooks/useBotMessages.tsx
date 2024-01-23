import { useCallback, useEffect, useState } from "react"
import { Message, ReactionEvents, ReactionListener } from "@ably-labs/chat"

import { botConfig } from "@/config/bots"

import { useConversation } from "./useConversation"

export const useBotMessages = (channelUsers: string[]) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const conversation = useConversation(botConfig.channelName)

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

    const handleReactionAdd: ReactionListener = ({ reaction }) => {}
    const handleReactionDelete: ReactionListener = ({ reaction }) => {}

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
      conversation.messages.unsubscribeReactions(
        ReactionEvents.added,
        handleReactionAdd
      )
      conversation.messages.unsubscribeReactions(
        ReactionEvents.deleted,
        handleReactionDelete
      )
    }
  }, [conversation, channelUsers])

  return {
    loading,
    messages,
    addReaction,
    removeReaction,
  }
}
