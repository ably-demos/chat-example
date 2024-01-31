"use client"

import { useCallback, useState } from "react"

import { useChat } from "@/hooks/chat/useChat"
import { useMessages } from "@/hooks/chat/useMessages"
import { useSession } from "@/hooks/useSession"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ChatHeader from "./ChatHeader"

type ChatProps = {}

// TODO: Review: Editing setup & useChat vs useConversation
const Chat = (_props: ChatProps) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState<string>("")
  const { conversationId } = useChat()

  const { session } = useSession()

  const {
    messages,
    isLoading,
    addReaction,
    removeReaction,
    sendMessage,
    editMessage,
    deleteMessage,
  } = useMessages(conversationId, session?.username)

  const handleSend = useCallback(
    (content: string) => {
      if (editingMessageId) {
        setEditingMessageId(null)
        return editMessage(editingMessageId, content)
      }
      return sendMessage(content)
    },
    [editMessage, editingMessageId, sendMessage]
  )

  const handleEditClick = useCallback((messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setInputValue(content)
  }, [])

  return (
    <Card className="flex flex-col rounded-none border-t-0 md:size-full">
      <CardHeader className="flex flex-row items-center">
        <ChatHeader />
      </CardHeader>
      <CardContent className="h-0 min-h-0 flex-auto space-y-2 overflow-y-auto">
        <MessageList
          messages={messages}
          loading={isLoading}
          username={session?.username!}
          onEdit={handleEditClick}
          onDelete={deleteMessage}
          onAddReaction={addReaction}
          onRemoveReaction={removeReaction}
        />
      </CardContent>
      <CardFooter>
        <MessageInput
          key={editingMessageId}
          defaultValue={inputValue}
          onSubmit={handleSend}
        />
      </CardFooter>
    </Card>
  )
}

export default Chat
