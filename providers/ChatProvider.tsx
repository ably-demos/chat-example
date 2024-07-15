import { createContext, FC, ReactNode, useMemo } from "react"
import { ChatClient, Room, RoomOptionsDefaults } from "@ably/chat"
import { useAbly } from "ably/react"

interface ChatContextProps {
  chatClient: ChatClient
  roomId: string
  room: Room
}

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
)

interface ChatProviderProps {
  children: ReactNode
  roomId: string
}

/**
 * Initializes the Chat SDK and provides the Chat context, which includes the Chat SDK client and the current room.
 *
 * @param children The children to render
 * @param roomId The ID of the room to join
 *
 * @returns children wrapped in a ChatContext.Provider
 * @example
 * <AblyProvider client={client}>
 *  <ChatProvider roomId={roomId}>
 *   <Chat />
 *  </ChatProvider>
 * </AblyProvider>
 *
 **/
const ChatProvider: FC<ChatProviderProps> = ({ children, roomId }) => {
  const ablyClient = useAbly()

  const context = useMemo(() => {
    const chatClient = new ChatClient(ablyClient)
    const room = chatClient.rooms.get(roomId, RoomOptionsDefaults)
    return {
      chatClient: chatClient,
      roomId: roomId,
      room: room,
      messages: [],
    }
  }, [ablyClient, roomId])

  return <ChatContext.Provider value={context}>{children}</ChatContext.Provider>
}

export default ChatProvider
