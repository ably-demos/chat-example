import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import {
  defaultSession,
  generateSession,
  getSession,
  SessionData,
} from "@/lib/session"

// read session
export async function GET() {
  const session = await getSession(cookies())

  if (!session) {
    return Response.json(defaultSession)
  }

  return Response.json(session)
}

const createSessionBodySchema = z.object({
  channel: z.string().nullable(),
})

export type CreateSessionBodySchema = z.infer<typeof createSessionBodySchema>

export async function POST(req: NextRequest, res: NextResponse<SessionData>) {
  const session = await getSession(cookies())

  const { username } = generateSession(session.username)

  session.username = username

  await session.save()

  return Response.json(session)
}
