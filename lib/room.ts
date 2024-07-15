import { customAlphabet } from "nanoid"

const alphanumeric =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const nanoid = customAlphabet(alphanumeric, 12)

export const generateRoomName = () => {
  return nanoid()
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

  return true
}
