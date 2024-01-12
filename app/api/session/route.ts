import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import prisma from "@/lib/prisma"
import { getSession, SessionData } from "@/lib/session"
import { createUser, generateUsername } from "@/app/controllers/user"

// read session
export async function GET() {
  const session = await getSession()

  const user = await prisma.user.findUnique({
    where: { username: session.username },
  })

  if (!session) {
    return Response.json(null, { status: 401 })
  }

  if (!user) {
    return Response.json(null, { status: 404 })
  }

  return Response.json(session)
}

const createSessionBodySchema = z.object({
  channel: z.string().nullable(),
})

export type CreateSessionBodySchema = z.infer<typeof createSessionBodySchema>

export async function POST(req: NextRequest, res: NextResponse<SessionData>) {
  const session = await getSession()

  // TODO: Validate Typings for SessionData
  if (!session.username) {
    const username = await generateUsername()
    session.username = username
  }

  let user = await prisma.user.findUnique({
    where: { username: session.username },
  })

  if (!user) {
    await createUser(session.username)
  }

  await session.save()

  return Response.json(session)
}

// TODO: handle user && channel cleanup on new session.destroy
