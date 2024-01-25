import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react"
import { Message } from "@ably-labs/chat"

interface MessageContextProps {
  messages: Message[]
  setMessages: Dispatch<SetStateAction<Message[]>>
}

export const MessageContext = createContext<MessageContextProps>({
  messages: [],
  setMessages: () => {},
})

interface MessageProviderProps {
  children: ReactNode
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
 *   <MessageProvider>
 *   </MessageProvider>
 *  </ChatProvider>
 * </AblyProvider>
 **/
const MessageProvider: FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([])

  const context = useMemo(
    () => ({ messages, setMessages }),
    [messages, setMessages]
  )

  return (
    <MessageContext.Provider value={context}>
      {children}
    </MessageContext.Provider>
  )
}

export default MessageProvider
