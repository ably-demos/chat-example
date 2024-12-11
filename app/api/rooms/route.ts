import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { createRoom } from "@/app/controllers/room"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getSession()

  const { name } = await req.json()

  if (!name) {
    return NextResponse.json(
      { error: "Missing 'name' in request body" },
      { status: 400 }
    )
  }

  const video = await prisma?.video.findFirst({})

  if (!video) return NextResponse.redirect("/")

  try {
    const room = await createRoom(name, video.id, session.username)
    return NextResponse.json(room)
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json(
      { error: "failed to create room" },
      { status: 500 }
    )
  }
}
