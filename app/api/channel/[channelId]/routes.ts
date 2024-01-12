import { cookies } from "next/headers"
import { Rest } from "ably"

import { getSession } from "@/lib/session"

export async function GET(
  request: Request,
  { params: { channelId } }: { params: { channelId: string } }
) {
  const channel = prisma?.channel.findUniqueOrThrow({
    where: {
      channelId,
    },
  })
  return Response.json(channel)
}

export async function POST(
  request: Request,
  { params: { channelId } }: { params: { channelId: string } }
) {
  const session = await getSession(cookies())
  if (!session) return Response.redirect("/login")

  const ably = new Rest.Promise({ key: process.env.ABLY_API_KEY! })

  ably.channels.get("conversations:" + channelId)

  const video = await prisma?.video.findFirstOrThrow({})

  if (!video) return Response.redirect("/")

  const channel = prisma?.channel.create({
    data: {
      channelId,
      video: {
        connect: {
          id: video.id,
        },
      },
      users: {
        connect: {
          username: session.username!,
        },
      },
    },
  })

  return Response.json(channel)
}
