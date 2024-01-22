"use client"

import { useCallback, useState } from "react"

import { useChat } from "@/hooks/useChat"
import { useSession } from "@/hooks/useSession"
import { useSimulatedUserCount } from "@/hooks/useSimulatedUserCount"
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
  const chat = useChat()
  const simulatedUserCount = useSimulatedUserCount()

  const handleSend = useCallback(
    (content: string) => {
      if (editingMessageId) {
        setEditingMessageId(null)
        return chat.messages.edit(editingMessageId, content)
      }
      return chat.messages.send(content)
    },
    [chat.messages, editingMessageId]
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
        <ChatHeader title="Chat room" userCount={simulatedUserCount} />
      </CardHeader>
      <CardContent className="size-full">
        <MessageList username={session?.username!} onEdit={handleEditClick} />
      </CardContent>
      <CardFooter>
        <MessageInput
          key={editingMessageId}
          defaultValue={inputValue}
          onSubmit={handleSend}
          onClear={handleClear}
        />
      </CardFooter>
    </Card>
  )
}

export default Chat
