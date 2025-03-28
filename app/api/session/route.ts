import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { SessionData } from "@/lib/session"
import { createUser, generateUsername } from "@/app/controllers/user"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const username = req.nextUrl.searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return NextResponse.json(
      { error: "user session not found" },
      { status: 404 }
    )
  }

  const session: SessionData = {
    username: user.username,
    avatar: user.avatar,
  }

  return NextResponse.json({ session })
}

// This is a POST request handler that creates a new user session
// and returns the session data as a JSON response.
// The session is not intended to be used for authentication, it is just
// provided as an example for this demo application.
export async function POST(): Promise<NextResponse> {
  const username = await generateUsername()

  let user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    user = await createUser(username)
  } else {
    // If the user already exists, we can return the existing user
    return NextResponse.json("The user already exists", { status: 409 })
  }
  const session: SessionData = {
    username: user.username,
    avatar: user.avatar,
  }
  return NextResponse.json({ session })
}
