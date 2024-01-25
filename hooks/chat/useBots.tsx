import { useContext, useEffect, useState } from "react"
import { MessageContext } from "@/providers/MessageProvider"
import { Message, ReactionEvents, ReactionListener } from "@ably-labs/chat"

import { botConfig } from "@/config/bots"

import { useInterval } from "../useInterval"
import { useConversation } from "./useConversation"
import { useReactionEvent } from "./useReactions"

export const useBots = () => {
  const [loading, setLoading] = useState(false)

  const { messages, setMessages } = useContext(MessageContext)
  const botConversation = useConversation(botConfig.channelName)
  const [messageCursor, setMessageCursor] = useState<string>()

  const conversation = useConversation(botConfig.channelName)
  const { addReaction, removeReaction } = conversation.messages

  useEffect(() => {
    if (process.env.WITH_BOTS !== "true") {
      return
    }

    setLoading(true)

    const handleReactionAdd: ReactionListener = ({ reaction }) => {}
    const handleReactionDelete: ReactionListener = ({ reaction }) => {}

    let mounted = true

    const initMessages = async () => {
      const firstMessages = await botConversation.messages.query({
        limit: 10,
        startId: messageCursor,
      })
      if (mounted) {
        setLoading(false)
        setMessages((prevMessages: Message[]) => [
          ...firstMessages,
          ...prevMessages,
        ])
        setMessageCursor(firstMessages.at(-1)?.id)
      }
    }

    setMessages([])
    initMessages()
  }, [botConversation, messageCursor, setMessages])

  useReactionEvent(botConversation, ReactionEvents.added, ({ reaction }) => {})
  useReactionEvent(
    botConversation,
    ReactionEvents.deleted,
    ({ reaction }) => {}
  )

  useInterval(() => {
    if (process.env.WITH_BOTS !== "true" || !messages.length) {
      return
    }
    botConversation.messages
      .query({
        limit: 10,
        startId: messageCursor,
      })
      .then((newMessages) => {
        setMessages((prevMessages) => [...newMessages, ...prevMessages])
        setMessageCursor(newMessages.at(-1)?.id)
      })
  }, 1000)

  return {
    loading,
    messages,
    addReaction,
    removeReaction,
  }
}
