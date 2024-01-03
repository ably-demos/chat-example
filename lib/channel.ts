import { nanoid } from "nanoid"

export const getRandomChannel = () => {
  if (process.env.NODE_ENV === "development") {
    return "default"
  }

  return nanoid(12)
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
