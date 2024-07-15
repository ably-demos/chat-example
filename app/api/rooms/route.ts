import { NextRequest } from "next/server"

import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { createRoom } from "@/app/controllers/room"

export async function POST(req: NextRequest) {
  const session = await getSession()
  const { name } = await req.json()

  const video = await prisma?.video.findFirst({})

  if (!video) return Response.redirect("/")

  const room = await createRoom(name, video.id, session.username)

  return Response.json(room)
}
