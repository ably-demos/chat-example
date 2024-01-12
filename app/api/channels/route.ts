import { Rest } from "ably"

import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { createChannel } from "@/app/controllers/channel"

export async function POST(request: Request) {
  const session = await getSession()
  const { name } = await request.json()

  if (!session) return Response.redirect("/login")

  const ably = new Rest.Promise({ key: process.env.ABLY_API_KEY! })

  /**
   * This creates a channel, if it doesn't exist.
   */
  await ably.channels.get("conversations:" + name).status()

  const video = await prisma?.video.findFirstOrThrow({})

  if (!video) return Response.redirect("/")

  const channel = await createChannel(name, video.id, session.username)

  return Response.json(channel)
}
