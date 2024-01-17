import { useContext } from "react"

import { ChatContext } from "@/components/ChatProvider"

export const useChat = () => {
  const { chat } = useContext(ChatContext) ?? {}
  if (!chat) throw new Error("Chat is not setup")
  return chat
}
