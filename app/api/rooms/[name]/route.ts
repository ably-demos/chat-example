import { NextRequest, NextResponse } from "next/server"
import { Room } from "@prisma/client"

import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { getRoom } from "@/app/controllers/room"

const addUserToRoom = (name: string, username: string) => {
  return prisma?.room.update({
    where: {
      name,
    },
    data: {
      users: {
        connect: {
          username,
        },
      },
    },
  })
}

export async function GET(
  _req: NextRequest,
  params: { params: Promise<{ name: string }> }
): Promise<NextResponse<Room>> {
  const session = await getSession()

  const { name } = await params.params

  if (!name) {
    return NextResponse.json(
      { error: "No room provided in URL" },
      { status: 400 }
    )
  }

  try {
    const { users, ...room } = await getRoom(name, session.username)

    if (!users.length) {
      await addUserToRoom(name, session.username)
    }
    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "room not found" }, { status: 404 })
  }
}
