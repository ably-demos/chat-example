import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"

import { defaultSession, getSession } from "@/lib/session"

const prisma = new PrismaClient()

// read session
export async function GET() {
  const session = await getSession(cookies())

  if (!session) {
    return Response.json(defaultSession)
  }

  const video = await prisma.video.findFirst({ include: { user: true } })

  return Response.json(video)
}
