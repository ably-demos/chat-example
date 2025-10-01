import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

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

  const apiKey = process.env.ABLY_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "ABLY_API_KEY is not configured",
      },
      {
        status: 500,
      }
    )
  }

  // Parse the API key to extract key name and secret
  const [keyName, keySecret] = apiKey.split(":")

  // Create JWT claims
  const claims = {
    "x-ably-capability": JSON.stringify({
      "[chat]*": ["*"],
    }),
    "x-ably-clientId": clientIdParam,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
  }

  // Sign the JWT with the key secret
  const token = jwt.sign(claims, keySecret, {
    keyid: keyName,
  })

  return new NextResponse(token, {
    status: 200,
    headers: {
      "Content-Type": "application/jwt",
    },
  })
}
