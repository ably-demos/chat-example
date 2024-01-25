import { Chat } from "@ably-labs/chat"
import { Realtime } from "ably/promises"

export const getChatClient = async () => {
  const client = new Realtime({
    key: process.env.ABLY_API_KEY,
  })

  return new Chat(client)
}
