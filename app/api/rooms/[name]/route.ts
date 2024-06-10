import { NextResponse } from "next/server"
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
  _req: Request,
  { params: { name } }: { params: { name: string } }
): Promise<NextResponse<Room>> {
  const session = await getSession()

  try {
    const { users, ...room } = await getRoom(name, session.username)

    if (!users.length) {
      await addUserToRoom(name, session.username)
    }

    return NextResponse.json(room)
  } catch (error) {
    return new NextResponse("room not found", { status: 404 })
  }
}
