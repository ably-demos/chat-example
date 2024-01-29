import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react"
import { Message } from "@ably-labs/chat"

interface MessageContextProps {
  messageStore: Message[]
  updateMessageStore: Dispatch<SetStateAction<Message[]>>
}

export const MessageContext = createContext<MessageContextProps>({
  messageStore: [],
  updateMessageStore: () => {},
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
  const [messageStore, setMessageStore] = useState<Message[]>([])

  const context = useMemo(
    // REVIEW: updateMessageStore/setMessageStore. Maybe YAGNI, but simple enough to help future proof
    () => ({ messageStore, updateMessageStore: setMessageStore }),
    [messageStore]
  )

  return (
    <MessageContext.Provider value={context}>
      {children}
    </MessageContext.Provider>
  )
}

export default MessageProvider
