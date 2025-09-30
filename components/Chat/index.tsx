"use client"

import { useEffect, useRef, useState } from "react"
import {
  Message,
  ChatMessageEvent,
  ChatMessageEventType,
  PaginatedResult,
} from "@ably/chat"
import { useMessages, useRoom } from "@ably/chat/react"

import { useBots } from "@/hooks/chat/useBots"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ChatHeader from "./ChatHeader"

type ChatProps = {}

// Binary insert to keep the array sorted efficiently
function insertSorted(array: Message[], newItem: Message): Message[] {
  let low = 0
  let high = array.length

  while (low < high) {
    const mid = (low + high) >>> 1
    if (newItem.before(array[mid])) {
      high = mid
    } else {
      low = mid + 1
    }
  }
  array.splice(low, 0, newItem)
  return array
}

const Chat = (_props: ChatProps) => {
  const messageListRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAtBottom, setIsAtBottom] = useState(true) // Add a state to track whether the user is at the bottom

  // Enable the bots in the chat
  const { roomName } = useRoom()
  useBots(roomName)

  const { sendMessage, updateMessage, deleteMessage, historyBeforeSubscribe } = useMessages({
    listener: (event: ChatMessageEvent) => {
      const message = event.message
      switch (event.type) {
        case ChatMessageEventType.Created: {
          setMessages((prevMessages) => {
            // Skip if already present
            const alreadyExists = prevMessages.some((m) => m.isSameAs(message))
            if (alreadyExists) return prevMessages

            return insertSorted([...prevMessages], message)
          })
          break
        }
        case ChatMessageEventType.Updated:
        case ChatMessageEventType.Deleted: {
          setMessages((prevMessages) => {
            console.log("got deletion or update event", event)
            const index = prevMessages.findIndex((other) =>
              message.isSameAs(other)
            )
            if (index === -1) {
              return prevMessages
            }

            const newMessage = prevMessages[index].with(event)

            // if no change, do nothing
            if (newMessage === prevMessages[index]) {
              return prevMessages
            }

            // copy array and replace the message
            const updatedArray = prevMessages.slice()
            updatedArray[index] = newMessage
            return updatedArray
          })
          break
        }
        default: {
          console.error("Unknown message", message)
        }
      }
    },
    onDiscontinuity: (discontinuity) => {
      console.error("Discontinuity detected", discontinuity)
      // reset the messages when a discontinuity is detected,
      setMessages([])
      // triggers the useEffect to fetch the initial messages again.
      setIsLoading(true)
    },
  })

  useEffect(() => {
    if (historyBeforeSubscribe && isLoading) {
      historyBeforeSubscribe({ limit: 50 })
        .then((result: PaginatedResult<Message>) => {
          setMessages((prevMessages) => [
            ...result.items.reverse(),
            ...prevMessages,
          ])
          setIsLoading(false)
        })
        .catch((error: unknown) => {
          console.error("Error fetching previous messages", error)
        })
    }
  }, [historyBeforeSubscribe, isLoading])

  useEffect(() => {
    if (isAtBottom && messageListRef.current) {
      console.log("atBottom", messageListRef.current)
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages, isAtBottom])

  return (
    <Card className="flex flex-col rounded-none border-t-0 md:size-full">
      <CardHeader className="flex flex-row items-center">
        <ChatHeader />
      </CardHeader>
      <CardContent className="h-0 min-h-0 flex-auto space-y-2 overflow-y-auto">
        <MessageList
          ref={messageListRef}
          messages={messages}
          loading={isLoading}
          onUpdate={updateMessage}
          onDelete={deleteMessage}
          onScrollStateChange={setIsAtBottom}
        />
      </CardContent>
      <MessageInput onSubmit={sendMessage} />
    </Card>
  )
}

export default Chat
