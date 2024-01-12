import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { getSession } from "./lib/session"

export const middleware = async (request: NextRequest) => {
  const session = await getSession()

  if (!session.username) {
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: "/watch",
}
