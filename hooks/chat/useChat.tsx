import { useContext } from "react"
import { ChatContext } from "@/providers/ChatProvider"

/**
 * @returns The current chat for the closest ChatProvider
 * @example
 * const {} = useChatContext()
 */
export const useChat = () => {
  const { chatClient, roomId, room } = useContext(ChatContext) ?? {}

  if (!chatClient) throw new Error("Chat client is not setup")
  if (!room) throw new Error("Room is not set")
  if (!roomId) throw new Error("No roomId is set")

  return {
    chatClient,
    roomId,
    room,
  }
}
