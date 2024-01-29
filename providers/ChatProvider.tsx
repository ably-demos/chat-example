import { createContext, FC, ReactNode, useMemo } from "react"
import { Chat, ConversationController as Conversation } from "@ably-labs/chat"
import { useAbly } from "ably/react"

interface ChatContextProps {
  client: Chat
  conversationId: string
  conversation: Conversation
}

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
)

interface ChatProviderProps {
  children: ReactNode
  conversationId: string
}

/**
 * Initializes the Chat SDK and provides the Chat context, which includes the Chat SDK client and the current conversation.
 *
 * @param client Ably client
 * @param conversationId The ID of the conversation to join
 *
 * @returns children wrapped in a ChatContext.Provider
 * @example
 * <AblyProvider client={client}>
 *  <ChatProvider conversationId={conversationId}>
 *   <Chat />
 *  </ChatProvider>
 * </AblyProvider>
 *
 **/
const ChatProvider: FC<ChatProviderProps> = ({ children, conversationId }) => {
  const ablyClient = useAbly()

  const context = useMemo(() => {
    const client = new Chat(ablyClient)
    const conversation = client.conversations.get(conversationId)
    return {
      client,
      conversationId: conversationId,
      conversation: conversation,
      messages: [],
    }
  }, [ablyClient, conversationId])

  return <ChatContext.Provider value={context}>{children}</ChatContext.Provider>
}

export default ChatProvider
