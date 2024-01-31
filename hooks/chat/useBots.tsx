import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { Message } from "@ably-labs/chat"
import { set } from "cypress/types/lodash"
import { sortBy, uniq } from "underscore"

import { BotConfig, botConfig } from "../../config/bots"
import { useInterval } from "../useInterval"
import { useConversation } from "./useConversation"

const BOT_INTERVAL = 2000

export const useBots = (botConfig: BotConfig, startTime?: number) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const pageCursor = useRef<string | null>(null)
  const conversation = useConversation(botConfig.channelName)

  useEffect(() => {
    setMessages([])
  }, [botConfig.channelName])

  useInterval(() => {
    if (!startTime) return

    const initMessages = async () => {
      const nextMessages = await conversation.messages.query({
        limit: 1,
        direction: "backwards",
        ...(pageCursor.current && { startId: pageCursor.current }),
      })
      setIsLoading(false)

      pageCursor.current = nextMessages.at(-1)?.id ?? null
      const adjustedMessages = nextMessages.map((message, index) =>
        updateMessageTime(message, index, startTime)
      )

      setMessages((prevMessages) =>
        uniq([...prevMessages, ...adjustedMessages], ({ id }) => id)
      )
    }

    initMessages()
  }, BOT_INTERVAL)
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
    messages,
    isLoading,
    removeReaction,
    addReaction,
  }
}

const updateMessageTime = (
  message: Message,
  index: number,
  startTime: number
): Message => {
  return {
    ...message,
    created_at: startTime + index * BOT_INTERVAL,
  }
}
