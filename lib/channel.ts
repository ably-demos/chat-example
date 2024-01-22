import { customAlphabet } from "nanoid"

const alphanumeric =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const nanoid = customAlphabet(alphanumeric, 12)

export const generateChannelName = () => {
  // if (process.env.NODE_ENV === "development") {
  //   return "default"
  // }

  return nanoid()
}

export const isValidChannel = (channel: string | null) => {
  if (!channel) {
    return false
  }

  if (process.env.NODE_ENV === "development") {
    return channel === "default"
  }

  return channel.length === 12
}
