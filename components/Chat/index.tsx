"use client"

import { useCallback, useState } from "react"

import { useChatContext } from "@/hooks/useChatContext"
import { useConversation } from "@/hooks/useConversation"
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
  const { conversationId } = useChatContext()
  const conversation = useConversation(conversationId)

  const handleSend = useCallback(
    (content: string) => {
      if (editingMessageId) {
        setEditingMessageId(null)
        return conversation.messages.edit(editingMessageId, content)
      }
      return conversation.messages.send(content)
    },
    [conversation.messages, editingMessageId]
  )

  const handleEditClick = useCallback((messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setInputValue(content)
  }, [])

  const handleClear = useCallback(() => {
    setEditingMessageId(null)
  }, [])

  return (
    <Card className="flex size-full flex-col rounded-none border-t-0">
      <CardHeader className="flex flex-row items-center">
        <ChatHeader />
      </CardHeader>
      <CardContent className="h-0 min-h-0 flex-auto space-y-2 overflow-y-auto">
        <MessageList username={session?.username!} onEdit={handleEditClick} />
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
