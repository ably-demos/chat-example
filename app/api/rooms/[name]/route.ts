import { NextRequest, NextResponse } from "next/server"
import { Room } from "@prisma/client"

import { getRoom } from "@/app/controllers/room"

export async function GET(
  _req: NextRequest,
  params: { params: Promise<{ name: string }> }
): Promise<NextResponse<Room>> {
  try {
    const { name } = await params.params

    if (!name) {
      return NextResponse.json(
        { error: "No room provided in URL" },
        { status: 400 }
      )
    }

    const foundRoom = await getRoom(name)

    if (!foundRoom) {
      return NextResponse.json("Room not found", { status: 404 })
    }

    return NextResponse.json(foundRoom)
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}
