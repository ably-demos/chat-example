import { customAlphabet } from "nanoid"

const alphanumeric =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const nanoid = customAlphabet(alphanumeric, 12)

export const generateRoomName = () => {
  return "chat:" + nanoid()
}

export const isValidRoom = (room: string | null) => {
  if (!room) {
    console.info("room is null")
    return false
  }

  if (room.length < 12 || room.length > 24) {
    console.info("Room must be between 12 and 24 characters")
    return false
  }

  // Rooms must be prefixed with `chat` i.e chat:12345, since we have defined our capabilities with a custom prefix like so: "chat:*": ["*"]
  // This is an example of namespacing, and is useful for managing larger applications with complex capability structures.
  // Other prefixes could be `video:`, `news:`, `sports:`, etc.
  if (!room.startsWith("chat:")) {
    console.info("Room must start with 'chat:' prefix")
    return false
  }

  return true
}
