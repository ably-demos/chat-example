import { useMemo } from "react"
import { Room, RoomOptionsDefaults } from "@ably/chat"

import { useChat } from "./useChat"

/**
 * @returns The current chat for the closest ChatProvider
 * @example
 * const room = useRoom("my-room-name")
 */
export const useRoom = (givenRoomId: string) => {
  const { chatClient, roomId, room } = useChat()

  return useMemo<Room>(() => {
    if (roomId && givenRoomId === roomId) {
      return room
    }
    return chatClient.rooms.get(givenRoomId, RoomOptionsDefaults)
  }, [chatClient.rooms, roomId, givenRoomId, room])
}
