import { useContext } from "react"
import { ChatContext } from "@/providers/ChatProvider"

export const useChat = () => {
  return useContext(ChatContext)
}
