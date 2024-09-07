import { useCallback, useEffect, useState } from "react"
import { Reaction, type RoomReactionListener } from "@ably/chat"

import { useRoom } from "./useRoom"

/**
 * @description This hook will return the room reactions for the current room and subscribe to new ones
 * @param roomName The name of the room to get messages from
 * @param username This will be the clientId on the message. It should likely be the unique username/id for the user in your system
 * @returns The latest room reaction for the current room and method to send room reactions.
 *
 * @example
 * const {
 *   latestRoomReaction,
 *   sendRoomReaction
 * } = useRoomReactions(roomId, username)
 */
export const useRoomReactions = (roomName: string, username?: string) => {
  const [latestRoomReaction, setLatestRoomReaction] = useState<Reaction>()
  const room = useRoom(roomName)

  useEffect(() => {
    // Define the reaction listener that will handle incoming reactions
    const handleAddRoomReaction: RoomReactionListener = (reaction) => {
      // if (reaction.isSelf) return
      setLatestRoomReaction(reaction)
    }
    // Subscribe to room reactions with the defined listener
    const { unsubscribe } = room.reactions.subscribe(handleAddRoomReaction)

    // Cleanup function to unsubscribe from room reactions and mark the component as unmounted
    return () => {
      unsubscribe()
    }
  }, [username, room])

  const sendRoomReaction = useCallback(
    (type: string) => {
      room.reactions.send({ type })
    },
    [room]
  )

  return {
    latestRoomReaction,
    sendRoomReaction,
  }
}
