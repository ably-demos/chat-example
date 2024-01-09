import { useContext } from "react"
import { ChatContext } from "@/providers/ChatProvider"

export const useConversations = () => {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error("Chat is not setup")
  }
  const { chat } = context

  if (!chat?.conversations) throw Error("Client is not setup!")

  return chat.conversations
}
