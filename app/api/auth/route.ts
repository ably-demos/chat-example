import { NextRequest } from "next/server"
import { Rest } from "ably"

import { getSession } from "@/lib/session"

const BOTS_ENABLED = process.env.NEXT_PUBLIC_WITH_BOTS === "true"

export async function GET(request: NextRequest) {
  const session = await getSession()
  const clientIdParam = request.nextUrl.searchParams.get("clientId")
  let clientId = session.username

  if (BOTS_ENABLED && clientIdParam) {
    clientId = clientIdParam
  }

  if (!session.username) {
    return Response.redirect("/")
  }

  const ably = new Rest.Promise({
    key: process.env.ABLY_API_KEY!,
    restHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
    realtimeHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
  })

  const token = await ably.auth.createTokenRequest({
    clientId,
    capability: {
      "conversations:*": ["*" as "subscribe"],
      "[conversation]*": ["*" as "subscribe"],
    },
  })

  return Response.json(token)
}
