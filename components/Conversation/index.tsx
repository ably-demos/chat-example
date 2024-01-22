"use client"

import { useCallback, useMemo, useState } from "react"

import useSession from "@/hooks/api/useSession"
import { useConversation } from "@/hooks/chat/useConversation"
import { useMessages } from "@/hooks/chat/useMessages"
import { useInterval } from "@/hooks/utils/useInterval"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ConversationHeader from "./ConversationHeader"

const increaseUserCount = (count: number) => {
  return Math.ceil(count * 1.05)
}

const decreaseUserCount = (count: number) => {
  return Math.floor(count * 0.95)
}

type ConversationProps = {}

const Conversation = (props: ConversationProps) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const { session } = useSession()
  const { messages } = useMessages(session?.username!)
  const conversation = useConversation()

  const handleSend = useCallback(
    async (content: string) => {
      if (editingMessageId) {
        return await conversation.messages.edit(editingMessageId, content)
      }
      await conversation.messages.send(content)
    },
    [conversation.messages, editingMessageId]
  )

  const handleEditClick = useCallback((messageId: string) => {
    setEditingMessageId(messageId)
  }, [])

  const handleClear = useCallback(() => {
    setEditingMessageId(null)
  }, [])

  // There should be a method on the SDK to get the message by id.
  const inputContent = useMemo<string | null>(() => {
    if (!editingMessageId) return null
    return messages?.find((m) => m.id === editingMessageId)?.content ?? null
  }, [messages, editingMessageId])

  const [onlineUserCount, setOnlineUserCount] = useState(800)

  useInterval(() => {
    const decrease = Math.random() < 0.5
    let nextUserCount = decrease
      ? decreaseUserCount(onlineUserCount)
      : increaseUserCount(onlineUserCount)

    if (nextUserCount > 1000) {
      nextUserCount = decreaseUserCount(onlineUserCount)
    } else if (nextUserCount < 700) {
      nextUserCount = increaseUserCount(onlineUserCount)
    }

    setOnlineUserCount(nextUserCount)
  }, 2500)

  return (
    <Card className="flex size-full flex-col rounded-none border-t-0">
      <CardHeader className="flex flex-row items-center">
        <ConversationHeader
          title="Chat room"
          onlineUserCount={onlineUserCount}
        />
      </CardHeader>
      <CardContent className="flex grow">
        <MessageList
          messages={messages}
          onEdit={handleEditClick}
          username={session?.username!}
        />
      </CardContent>
      <CardFooter>
        <MessageInput
          key={editingMessageId}
          onSubmit={handleSend}
          defaultValue={inputContent}
          onClear={handleClear}
        />
      </CardFooter>
    </Card>
  )
}

export default Conversation
