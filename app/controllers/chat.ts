import { Chat } from "@ably-labs/chat"
import { Realtime, Rest } from "ably/promises"

export const getChatClient = async () => {
  const client = new Realtime({
    authUrl: "http://localhost:3000/api/auth",
    restHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
    realtimeHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
  })

  return new Chat(client)
}
