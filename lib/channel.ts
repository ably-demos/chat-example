import { customAlphabet } from "nanoid"
import { alphanumeric } from "nanoid-dictionary"

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

  // if (process.env.NODE_ENV === "development") {
  //   return channel === "default"
  // }

  return channel.length === 12
}
