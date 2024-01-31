import { NextRequest } from "next/server"
import { Rest } from "ably"

import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  const session = await getSession()
  console.error(request.nextUrl.searchParams.get("clientId"))
  const ably = new Rest.Promise({
    key: process.env.ABLY_API_KEY!,
    restHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
    realtimeHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
  })

  const token = await ably.auth.createTokenRequest({
    clientId: session.username,
    // REVIEW: The capabilities seem to be changing daily, and they're not documented.
    // capability: {
    //   "conversations:*": [
    //     "publish",
    //     "subscribe",
    //     "presence",
    //     "create" as "subscribe",
    //     "delete" as "subscribe",
    //   ],
    //   "[conversation]*": [
    //     "publish",
    //     "subscribe",
    //     "presence",
    //     "history",
    //     "create" as "subscribe",
    //     "delete" as "subscribe",
    //   ],
    // },
  })

  return Response.json(token)
}
