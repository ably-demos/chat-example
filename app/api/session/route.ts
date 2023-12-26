import { cookies } from "next/headers"

import { defaultSession, generateSession, getSession } from "@/lib/session"

// read session
export async function GET() {
  const session = await getSession(cookies())

  if (!session) {
    return Response.json(defaultSession)
  }

  return Response.json(session)
}

export async function POST() {
  const session = await getSession(cookies())

  const { username, channelRef } = generateSession()

  session.username = username
  session.channelRef = channelRef
  await session.save()

  return Response.json(session)
}

export async function DELETE() {
  const session = await getSession(cookies())

  session.destroy()

  return Response.json(generateSession())
}
