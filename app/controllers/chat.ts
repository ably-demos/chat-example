import { Chat } from "@ably-labs/chat"
import { Realtime } from "ably/promises"

export const getChatClient = async (origin: string) => {
  const client = new Realtime({
    authUrl: `${origin}/api/auth`,
    restHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
    realtimeHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
  })

  return new Chat(client)
}
