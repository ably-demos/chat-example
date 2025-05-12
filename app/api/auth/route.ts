import { NextRequest, NextResponse } from "next/server"
import Ably from "ably"

export async function GET(request: NextRequest) {
  // get client id from query params
  const clientIdParam = request.nextUrl.searchParams.get("clientId")

  // Check client id is present
  if (!clientIdParam || clientIdParam === "*") {
    return NextResponse.json(
      {
        error: "valid clientId is required",
      },
      {
        status: 400,
      }
    )
  }

  const client = new Ably.Rest({
    key: process.env.ABLY_API_KEY,
    environment: "local",
    tls: false,
    port: 8081,
  })
  // create token request with the client id and chat capabilities
  const tokenRequestData = await client.auth.createTokenRequest({
    capability: {
      "[chat]*": ["*"],
    },
    clientId: clientIdParam!,
  })

  return NextResponse.json(tokenRequestData, {
    status: 200,
  })
}
