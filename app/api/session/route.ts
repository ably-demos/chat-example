import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSession, SessionData } from "@/lib/session"
import { createUser, generateUsername } from "@/app/controllers/user"

export async function GET() {
  const session = await getSession()

  if (!session.username) {
    return Response.json(null, { status: 404 })
  }

  let user = null
  try {
    user = await prisma.user.findUnique({
      where: { username: session.username },
    })
  } catch (error) {
    console.error(error)
  }

  if (!user) {
    return Response.json(null, { status: 404 })
  }

  return Response.json(session)
}

export async function POST(req: NextRequest, res: NextResponse<SessionData>) {
  const session = await getSession()

  if (!session.username) {
    const username = await generateUsername()
    session.username = username
  }

  const user = await prisma.user.findUnique({
    where: { username: session.username },
  })

  if (!user) {
    await createUser(session.username)
  }

  await session.save()

  return Response.json(session)
}
