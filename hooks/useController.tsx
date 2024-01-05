import { useContext } from "react"
import { ChatContext } from "@/providers/ChatProvider"

export const useController = () => {
  const context = useContext(ChatContext)

  if (!context) throw Error("Client is not setup!")

  return context.conversation
}
