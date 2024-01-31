import { customAlphabet } from "nanoid"

const alphanumeric =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const nanoid = customAlphabet(alphanumeric, 12)

export const generateChannelName = () => {
  return nanoid()
}

export const isValidChannel = (channel: string | null) => {
  if (!channel) {
    return false
  }

  return channel.length === 12
}
