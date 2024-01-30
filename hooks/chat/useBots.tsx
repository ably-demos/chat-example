import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Message } from "@ably-labs/chat"
import { sortBy } from "underscore"

import { botConfig } from "../../config/bots"
import { useConversation } from "./useConversation"

const sortByCreated = (messages: Message[]) => {
  return sortBy(messages, ({ created_at }) => created_at)
}

export const useBots = (setMessages: Dispatch<SetStateAction<Message[]>>) => {
  const [pageCursor, setPageCursor] = useState<string | null>(null)
  const conversation = useConversation(botConfig.channelName)

  useEffect(() => {
    let mounted = true
    const initMessages = async () => {
      const nextMessages = await conversation.messages.query({
        limit: 2,
        // REVIEW
        ...(pageCursor && { startId: pageCursor }),
      })
      if (mounted) {
        /**
         * Filter messages by bot username prefix or members of the users conversation
         */

        let lastItem = nextMessages.at(-1)
        if (lastItem?.id) {
          setPageCursor(lastItem.id)
        }

        setMessages((prevMessages) =>
          sortByCreated([...prevMessages, ...nextMessages])
        )
      }
    }
    setPageCursor(null)
    initMessages()

    return () => {
      mounted = false
    }
  }, [conversation, pageCursor, setMessages])

  return null
}
