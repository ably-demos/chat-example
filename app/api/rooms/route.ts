import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { createRoom, getRoom } from "@/app/controllers/room"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name } = await req.json()
    if (!name) {
      return NextResponse.json(
        { error: "Missing 'name' in request body" },
        { status: 400 }
      )
    }

    const video = await prisma?.video.findFirst({})

    if (!video) return NextResponse.redirect("/")

    const foundRoom = await getRoom(name)

    // If the room already exists, return it
    if (foundRoom) {
      return NextResponse.json(foundRoom)
    }

    // Create a new room
    const room = await createRoom(name, video.id)
    return NextResponse.json(room)
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json(
      { error: "failed to create room" },
      { status: 500 }
    )
  }
}
