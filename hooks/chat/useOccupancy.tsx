import { useCallback, useEffect, useState } from "react"
import { OccupancyListener, Room } from "@ably/chat"

import { useChat } from "@/hooks/chat/useChat"

const useOccupancyEvent = (room: Room, cb: OccupancyListener) => {
  useEffect(() => {
    if (!room) return
    const { unsubscribe } = room.occupancy.subscribe(cb)
    return () => {
      unsubscribe()
    }
  }, [room, cb])
}

/**
 * Listens to the occupancy event in the current room and returns the number of users online.
 * @returns The number of users online in the current room
 */
export const useOccupancyCount = () => {
  const [onlineUserCount, setOnlineUserCount] = useState(0)
  const { room } = useChat()

  const handleAdd: OccupancyListener = useCallback((event) => {
    setOnlineUserCount(event.connections)
  }, [])

  // Call the custom hook to handle occupancy events
  useOccupancyEvent(room, handleAdd)

  return onlineUserCount
}
