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

  if (!clientId) {
    return Response.json({ error: "No client ID provided" }, { status: 400 })
  }

  const ably = new Rest.Promise({
    key: process.env.ABLY_API_KEY!,
    restHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
    realtimeHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
  })

  const token = await ably.auth.createTokenRequest({
    clientId: clientId,
    capability: {
      "conversations:*": ["publish", "subscribe", "presence"],
      "[conversation]*": ["*" as "subscribe"],
    },
  })

  return Response.json(token)
}
