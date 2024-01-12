"use client"

import { useCallback, useMemo, useState } from "react"
import { Maybe } from "@/types"

import { useConversation } from "@/hooks/chat/useConversation"
import { useConversationId } from "@/hooks/chat/useConversationId"
import { useMessages } from "@/hooks/chat/useMessages"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ConversationHeader from "./ConversationHeader"

type ConversationProps = {}

const Conversation = (props: ConversationProps) => {
  const conversationId = useConversationId()
  const conversation = useConversation(conversationId)

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const messages = useMessages(conversationId)

  const handleSend = useCallback(
    async (content: string) => {
      if (editingMessageId) {
        return await conversation.messages.edit(editingMessageId, content)
      }
      await conversation.messages.send(content)
    },
    [conversation.messages, editingMessageId]
  )

  const handleEditClick = useCallback(async (messageId: string) => {
    setEditingMessageId(messageId)
  }, [])

  const handleClear = useCallback(async () => {
    setEditingMessageId(null)
  }, [])

  const handleDeleteClick = useCallback(
    async (messageId: string) => {
      if (!conversation) {
        console.error("Skipping delete. Check Channel is set.")
        return
      }

      await conversation.messages.delete(messageId)
    },
    [conversation]
  )

  const handleAddReaction = useCallback(
    async (messageId: string) => {
      await conversation.messages.addReaction(messageId, "👍")
    },
    [conversation.messages]
  )

  // There should be a method on the SDK to get the message by id.
  const inputContent = useMemo<Maybe<string>>(
    () =>
      editingMessageId
        ? messages.find((m) => m.id === editingMessageId)?.content
        : null,
    [messages, editingMessageId]
  )

  return (
    <Card className="flex h-full w-full flex-col rounded-none border-t-0">
      <CardHeader className="flex flex-row items-center">
        <ConversationHeader title="Chat room" onlineUserCount={928} />
      </CardHeader>
      <CardContent className="flex grow">
        <MessageList
          messages={messages}
          onAddReaction={handleAddReaction}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
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
