"use client"

import { useCallback, useState } from "react"

import { useMessages } from "@/hooks/chat/useMessages"
import { useSession } from "@/hooks/useSession"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ChatHeader from "./ChatHeader"

type ChatProps = {}

// TODO: Review: Editing setup & useChat vs useConversation
const Chat = (props: ChatProps) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState<string>("")

  const { session } = useSession()

  const {
    messages,
    isLoading,
    addReaction,
    removeReaction,
    sendMessage,
    editMessage,
    deleteMessage,
  } = useMessages(session?.username!)

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
    <Card className="flex size-full flex-col rounded-none border-t-0">
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
