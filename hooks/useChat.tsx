import { ChatContext } from "@/components/ChatProvider"
import { useContext, useMemo } from "react"


/**
 * @returns The current chat for the closest ChatProvider
 * @example
 * const {} = useChatContext()
 */
export const useChatContext = () => {
  const { chat } = useContext(ChatContext) ?? {}

  if (!chat) throw new Error("Chat is not setup")

  return useMemo(() => chat, [chat])
}
