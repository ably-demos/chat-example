import { cookies } from "next/headers"
import { Rest } from "ably"

import { getSession } from "@/lib/session"

export async function POST(request: Request) {
  const session = await getSession(cookies())
  const { name } = await request.json()

  if (!session) return Response.redirect("/login")

  const ably = new Rest.Promise({ key: process.env.ABLY_API_KEY! })

  /**
   * This creates a channel, if it doesn't exist.
   */
  await ably.channels.get("conversations:" + name).status()

  const video = await prisma?.video.findFirstOrThrow({})

  if (!video) return Response.redirect("/")

  const channel = await prisma.channel.create({
    data: {
      name,
      video: {
        connect: {
          id: video.id,
        },
      },
      users: {
        connect: {
          username: session.username,
        },
      },
    },
  })

  return Response.json(channel)
}
