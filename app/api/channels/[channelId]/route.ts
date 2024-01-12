import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { Channel } from "@prisma/client"

import { getSession } from "@/lib/session"

const addUserToChannel = (name: string, username: string) => {
  return prisma.channel.update({
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

export const getChannel = async (name: string, username: string) => {
  const channel = await prisma.channel.findUniqueOrThrow({
    where: { name },
    include: {
      users: { where: { username: username } },
    },
  })

  if (!channel) {
    throw new Error("Channel not found")
  }

  return channel
}

export async function GET(
  _: Request,
  { params: { name } }: { params: { name: string } }
): Promise<NextResponse<Channel>> {
  const session = await getSession(cookies())

  const { users, ...channel } = await getChannel(name, session.username)

  if (!users.length) {
    await addUserToChannel(name, session.username)
  }

  return NextResponse.json(channel)
}
