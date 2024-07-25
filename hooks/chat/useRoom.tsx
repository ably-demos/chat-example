import {useContext, useLayoutEffect} from "react"
import {RoomContext} from "@/providers/RoomProvider"
import {Room} from "@ably/chat";

/**
 * @returns The current room for the closest RoomProvider
 * @example
 * const {room} = useRoom()
 */
export const useRoom = (): { room: Room } => {
  const {room} = useContext(RoomContext) ?? {}
  if (!room) throw new Error("Room is not set")
  useLayoutEffect(() => {
    // Attach to the room. Starts all features of the room.
    room.attach();

    return () => {
      // cleanup: detach the room. Stops all enabled features of the room.
      room.detach();
    };
  }, [room]);
  return {
    room,
  }
}
