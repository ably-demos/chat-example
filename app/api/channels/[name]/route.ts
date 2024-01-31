import { NextResponse } from "next/server"
import { Channel } from "@prisma/client"

import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { getChannel } from "@/app/controllers/channel"

const addUserToChannel = (name: string, username: string) => {
  return prisma?.channel.update({
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
): Promise<NextResponse<Channel>> {
  const session = await getSession()

  try {
    const { users, ...channel } = await getChannel(name, session.username)

    if (!users.length) {
      await addUserToChannel(name, session.username)
    }

    return NextResponse.json(channel)
  } catch (error) {
    return new NextResponse(null, { status: 404 })
  }
}
