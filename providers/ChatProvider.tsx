import { createContext, FC, ReactNode, useMemo } from "react"
import { Chat, ConversationController } from "@ably-labs/chat"

interface ChatContextProps {
  client: Chat
  conversation: ConversationController
}

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
)

interface ChatProviderProps {
  client: Chat
  conversationId: string
  children: ReactNode
}
export const ChatProvider: FC<ChatProviderProps> = ({
  client,
  conversationId,
  children,
}) => {
  const value = useMemo(
    () => ({
      client,
      conversation: client.conversations.get(conversationId),
    }),
    [client, conversationId]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
