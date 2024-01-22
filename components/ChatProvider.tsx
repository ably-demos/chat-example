import { createContext, FC, ReactNode, useMemo } from "react"
import { Chat } from "@ably-labs/chat"
import { useAbly } from "ably/react"

interface ChatContextProps {
  chat: Chat
  conversationId: string
  // conversations: Conversations
}

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
)

interface ChatProviderProps {
  children: ReactNode
  conversationId: string
}

const ChatProvider: FC<ChatProviderProps> = ({ children, conversationId }) => {
  const client = useAbly()

  const context = useMemo(
    () => ({ chat: new Chat(client), conversationId }),
    [client, conversationId]
  )

  return <ChatContext.Provider value={context}>{children}</ChatContext.Provider>
}

export default ChatProvider
