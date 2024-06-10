import { useCallback, useEffect, useState } from "react"
import { Message, type MessageListener } from "@ably/chat"

import { useRoom } from "./useRoom"

/** When receiving new messages via subscription and history query, this function will combine them and remove dupes*/
const combineMessages = (
  previousMessages: Message[],
  lastMessages: Message[]
) => {
  return [
    ...previousMessages.filter((msg) =>
      lastMessages.every(
        (lastMessage) => lastMessage.timeserial != msg.timeserial
      )
    ),
    ...lastMessages,
  ]
}

/**
 * @description This hook will return the messages for the current room, subscribe to new ones
 * @param roomId The roomId to get messages from
 * @param username This will be the clientId on the message. It should likely be the unique username/id for the user in your system
 * @returns The messages for the current room, loading status and method to send.
 *
 * @example
 * const {
 *   messages,
 *   loading,
 *   sendMessage,
 * } = useMessages(roomId, username)
 */
export const useMessages = (roomId: string, username?: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const room = useRoom(roomId)

  useEffect(() => {
    setMessages([])
  }, [roomId])

  useEffect(() => {
    // Set loading state to true when the effect is first run
    setIsLoading(true)

    // Define the message listener that will handle incoming messages
    const handleAdd: MessageListener = ({ message }) => {
      setMessages((prevMessages) => [...prevMessages, message])
    }

    // Subscribe to message events with the defined listener
    const { unsubscribe, getPreviousMessages } =
      room.messages.subscribe(handleAdd)
    let isMounted = true

    // Fetches the initial set of messages and combines them with the existing messages
    const fetchInitialMessages = async () => {
      try {
        const lastMessages = await getPreviousMessages({ limit: 50 })
        if (isMounted) {
          setMessages((prevMessages) =>
            combineMessages(prevMessages, lastMessages.items).reverse()
          )
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching initial messages", error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchInitialMessages()

    // Cleanup function to unsubscribe from messages and mark the component as unmounted
    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [username, room])

  const sendMessage = useCallback(
    (text: string) => {
      room.messages.send({ text: text })
    },
    [room]
  )

  return {
    isLoading,
    messages,
    sendMessage,
  }
}
